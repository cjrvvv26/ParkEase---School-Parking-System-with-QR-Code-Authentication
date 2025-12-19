const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

exports.customizePrompt = async (req, res) => {
  const { model, color, brand } = req.body;
  try {
    const prompt = `
    Fix and validate motorcycle user's input.

    Model: ${model}
    Color: ${color}
    Brand: ${brand}
    Information: [an information about the requested motorcycle. At least 3 to 4 sentences.]

    Return JSON exactly in this shape:
    {
      "model": "",
      "color": "",
      "brand": "",
      "information": "",
      search_query: "brand model color motorcycle"
    }
  `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelAI = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await modelAI.generateContent(prompt);
    const responseText = result.response.text();

    const extractJSON = responseText.match(/\{[\s\S]*\}/);
    if (!extractJSON) {
      throw new Error("No JSON found in Gemini response");
    }

    const data = JSON.parse(extractJSON[0]);

    const googleURL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      data.search_query
    )}&searchType=image&key=${process.env.GOOGLE_CUSTOM_SEARCH_KEY}&cx=${
      process.env.SEARCH_ENGINE_ID
    }`;

    const googleResponse = await axios.get(googleURL);
    const images = googleResponse.data.items;
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found" });
    }

    res.status(200).json({
      corrected: data,
      imageUrl: images[0].link,
      allImages: images.map((i) => i.link),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error processing request" });
  }
};
