'use strict';

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const { sendError } = require('../utils/apiResponse');

// ─── Simple in-memory response cache ─────────────────────────────────────────
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getCacheKey(message, role) {
  return `${role}::${message.toLowerCase().trim()}`;
}

function getFromCache(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.text;
}

function setCache(key, text) {
  // Keep cache under 500 entries
  if (responseCache.size >= 500) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
  responseCache.set(key, { text, timestamp: Date.now() });
}

// ─── Retry with exponential backoff ──────────────────────────────────────────
async function callWithRetry(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const is429 = error.message && error.message.includes('429');
      if (!is429 || i === retries - 1) throw error;
      console.warn(`[CHAT] 429 rate limit hit — retrying in ${delay}ms (attempt ${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // exponential backoff
    }
  }
}

exports.handleChat = asyncHandler(async (req, res, next) => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[CHAT DEBUG] API Key configured:', !!apiKey);
  
  if (!apiKey) {
    return sendError(res, { status: 500, message: 'GEMINI_API_KEY is not configured', code: 'CONFIG_ERROR' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const { message, history, role: bodyRole } = req.body;
  console.log('[CHAT DEBUG] Message:', message, '| Role:', bodyRole);

  if (!message) {
    return sendError(res, { status: 400, message: 'Message is required', code: 'VALIDATION_ERROR' });
  }

  let role = bodyRole || 'guest';
  if (!bodyRole && req.user) {
    role = req.user.role === 'admin' ? 'admin' : (req.user.role === 'agent' ? 'agent' : 'user');
  }

  // ─── Check cache first ──────────────────────────────────────────────────────
  const cacheKey = getCacheKey(message, role);
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('[CHAT] Cache HIT for:', cacheKey);
    return res.status(200).json({ success: true, data: { text: cached, roleDetected: role, cached: true } });
  }

  let knowledgeBaseContext = '';
  try {
    const kbPath = path.join(__dirname, '../data/knowledgeBase.json');
    const kbData = fs.readFileSync(kbPath, 'utf8');
    knowledgeBaseContext = `\nKnowledge Base Data (Use this for FAQs and Platform Rules):\n${kbData}\n`;
  } catch (error) {
    console.warn('Could not load knowledgeBase.json');
  }

  const systemPrompt = `You are a helpful AI assistant for a Real Estate Web Application.
The user's role is: ${role}. 
Adjust your answer according to their role.

Roles capabilities:
- guest: Can search for properties, learn about the platform, and should be encouraged to register/login.
- user: Can search properties by location, budget, type (1BHK, 2BHK, Villa), guide them how to contact agents, or manage their shortlist.
- agent / property owner: Can manage their properties, view leads, and update lead status.
- admin: Can manage users, properties, leads, or edit website content (CMS, homepage, images, SEO).

Rules:
- Keep answers short, clear, and helpful.
- Provide step-by-step guidance when needed.
- Suggest actions or buttons where appropriate. You can suggest an action by formatting it like [ACTION: View Properties] or [ACTION: Contact Agent] or [ACTION: Add Property] at the end of your message.
- ALWAYS respond in markdown.
- Language Support: You MUST fully support conversational responses in 4 formats based on the user's input: English, Hindi, Marathi, and Eng-Marathi (Marathi written in the English alphabet). Always match the user's language and script.
- DO NOT hallucinate features outside of this system. Keep within the Real Estate context.
${knowledgeBaseContext}
`;

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    safetySettings
  });

  const chatHistory = [];
  if (history && Array.isArray(history)) {
    history.forEach(msg => {
      const isError = msg.text && (msg.text.includes('Error:') || msg.text.includes('quota'));
      chatHistory.push({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: isError ? "I had a temporary issue. Please continue." : msg.text }]
      });
    });
  }

  if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
    chatHistory.push({ role: 'model', parts: [{ text: "Understood. Please go ahead." }] });
  }

  const chat = model.startChat({ history: chatHistory });

  try {
    const responseText = await callWithRetry(async () => {
      const result = await chat.sendMessage(message);
      return result.response.text();
    });

    console.log('[CHAT DEBUG] Success response generated');
    setCache(cacheKey, responseText);

    res.status(200).json({
      success: true,
      data: { text: responseText, roleDetected: role }
    });
  } catch (error) {
    console.error('[CHAT ERROR] Gemini API Failure:', error.message);
    
    // Handle quota error gracefully
    if (error.message && error.message.includes('429')) {
      return res.status(200).json({
        success: true,
        data: {
          text: "🙏 I'm experiencing high demand right now and have temporarily reached my daily limit. Please try again in a few minutes or come back tomorrow.\n\nMeanwhile, you can:\n- Browse our [Properties](/properties) directly\n- [Contact us](/contact) for assistance\n\n[ACTION: View Properties][ACTION: Contact Us]",
          roleDetected: role
        }
      });
    }

    return sendError(res, { 
      status: 500, 
      message: `AI Error: ${error.message}`, 
      code: 'SERVER_ERROR' 
    });
  }
});
