'use strict';

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const { sendError } = require('../utils/apiResponse');

exports.handleChat = asyncHandler(async (req, res, next) => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[CHAT DEBUG] Using API Key (masked):', apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING');
  
  if (!apiKey) {
    return sendError(res, { status: 500, message: 'GEMINI_API_KEY is not configured', code: 'CONFIG_ERROR' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const { message, history, role: bodyRole } = req.body;
  console.log('[CHAT DEBUG] Incoming Message:', message);
  console.log('[CHAT DEBUG] Detected Role:', bodyRole);

  if (!message) {
    return sendError(res, { status: 400, message: 'Message is required', code: 'VALIDATION_ERROR' });
  }

  let role = bodyRole || 'guest';
  // Fallback to token if role not explicitly provided in body
  if (!bodyRole && req.user) {
    role = req.user.role === 'admin' ? 'admin' : (req.user.role === 'agent' ? 'agent' : 'user');
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
    // We need to ensure alternating user/model roles. 
    // If a message is an error, we replace it with a neutral acknowledgement to maintain the chain.
    history.forEach(msg => {
      const isError = msg.text && msg.text.includes('Sorry, I encountered an error');
      chatHistory.push({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: isError ? "I had a temporary connection issue. Please continue." : msg.text }]
      });
    });
  }

  // Final check: history must end with a 'model' role for the next sendMessage (user) to be valid
  // If history is empty, that's fine. If it ends with 'user', we add a dummy model response.
  if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
    chatHistory.push({
      role: 'model',
      parts: [{ text: "Understood. Please go ahead." }]
    });
  }

  const chat = model.startChat({
    history: chatHistory,
  });

  try {
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    console.log('[CHAT DEBUG] Success response generated');

    res.status(200).json({
      success: true,
      data: {
        text: responseText,
        roleDetected: role
      }
    });
  } catch (error) {
    console.error('[CHAT ERROR] Gemini API Failure:', error.message);
    return sendError(res, { 
      status: 500, 
      message: `AI Error: ${error.message}`, 
      code: 'SERVER_ERROR' 
    });
  }
});
