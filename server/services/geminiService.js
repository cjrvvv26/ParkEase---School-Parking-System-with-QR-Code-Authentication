// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateMotorcycleData = async ({ model, color, brand }) => {
  const prompt = `
Fix and validate motorcycle user's input.

Model: ${model}
Color: ${color}
Brand: ${brand}

Return JSON exactly in this shape:
{
  "model": "",
  "color": "",
  "brand": "",
  "information": [an information about the requested motorcycle. At least 3 to 4 sentences.],
  "search_query": "brand model color motorcycle"
}
`;

  const modelAI = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await modelAI.generateContent(prompt);
  const responseText = result.response.text();

  const extractJSON = responseText.match(/\{[\s\S]*\}/);
  if (!extractJSON) {
    throw new Error("No JSON found in Gemini response");
  }

  return JSON.parse(extractJSON[0]);
};
