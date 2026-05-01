const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyCQ2ThiZHK9Vjk-KX4Jgsr54G_qWlIoLOM');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("hello in hindi");
    console.log("SUCCESS:", result.response.text());
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

test();
