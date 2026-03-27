import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function runChat(prompt) {
  try {
    const result = await model.generateContent({
      contents: [prompt]
    });

    // Safe fallback if result.text is undefined
    return result.text || result.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini Error:", error);

    if (error.message.includes("404")) {
      return "Error: Model name 'gemini-1.5-flash' not found. Check API version.";
    }

    return "AI service busy. Try again.";
  }
}

export default runChat;