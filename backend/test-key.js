const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyAuyJGW2C7pxbC3bB7Zc_1wuRviH7pAF1Y');
    
    // Try different model names
    const modelsToTest = [
      'gemini-pro', 'gemini-1.0-pro', 'gemini-2.5-flash', 
      'gemini-2.0-flash-lite', 'gemini-flash', 'gemini-2.0-flash-exp'
    ];
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("hi");
        console.log(`SUCCESS with model: ${modelName}`, result.response.text().substring(0, 50));
        break;
      } catch (error) {
        console.log(`FAILED: ${modelName} -> ${error.message.substring(0, 80)}`);
      }
    }
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

listModels();
