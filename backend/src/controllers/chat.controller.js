'use strict';
console.log('[SYSTEM] Chat Controller v3.1 Loaded');

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
  try {
    const apiKeysRaw = process.env.GEMINI_API_KEY || '';
    const apiKeys = apiKeysRaw.split(',').map(k => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) {
      return sendError(res, { status: 500, message: 'GEMINI_API_KEY is not configured', code: 'CONFIG_ERROR' });
    }

    const { message, history, role: bodyRole } = req.body;
    if (!message) {
      return sendError(res, { status: 400, message: 'Message is required', code: 'VALIDATION_ERROR' });
    }

    let role = bodyRole || 'guest';
    if (!bodyRole && req.user) {
      role = req.user.role === 'admin' ? 'admin' : (req.user.role === 'agent' ? 'agent' : 'user');
    }

    const cacheKey = getCacheKey(message, role);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, data: { text: cached, roleDetected: role, cached: true } });
    }

    let knowledgeBaseContext = '';
    try {
      const kbPath = path.join(__dirname, '../data/knowledgeBase.json');
      if (fs.existsSync(kbPath)) {
        const kbData = fs.readFileSync(kbPath, 'utf8');
        knowledgeBaseContext = `\nKnowledge Base Data:\n${kbData}\n`;
      }
    } catch (error) {
      console.warn('Could not load knowledgeBase.json');
    }

    const systemPrompt = `You are a helpful AI assistant for a Real Estate Web Application.
User role: ${role}.
Suggest actions like [ACTION: View Properties].
Match the user's language (English, Hindi, Marathi).
${knowledgeBaseContext}`;

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const chatHistory = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        if (!msg || !msg.text) return;
        const isError = msg.text.includes('Error:') || msg.text.includes('quota');
        chatHistory.push({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: isError ? "Temporary issue." : msg.text }]
        });
      });
    }

    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
      chatHistory.push({ role: 'model', parts: [{ text: "Understood." }] });
    }

    let lastError = null;
    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          systemInstruction: systemPrompt,
          safetySettings
        });

        const chat = model.startChat({ history: chatHistory });

        const responseText = await callWithRetry(async () => {
          const result = await chat.sendMessage(message);
          return result.response.text();
        });

        setCache(cacheKey, responseText);
        return res.status(200).json({
          success: true,
          data: { text: responseText, roleDetected: role }
        });
      } catch (error) {
        lastError = error;
        const errorMsg = error?.message || String(error) || 'Unknown error';
        console.error(`[CHAT ERROR] Key ${i + 1} failed:`, errorMsg);
        
        if (i === apiKeys.length - 1) {
          if (errorMsg.includes('429')) {
            return res.status(200).json({
              success: true,
              data: {
                text: "🙏 I'm experiencing high demand. Please try again soon.\n\n[ACTION: View Properties]",
                roleDetected: role
              }
            });
          }
          return sendError(res, { status: 500, message: `AI Error: ${errorMsg}` });
        }
        continue;
      }
    }
  } catch (fatalErr) {
    console.error('[FATAL CHAT ERROR]', fatalErr);
    return sendError(res, { status: 500, message: `System Error: ${fatalErr.message}` });
  }
});
