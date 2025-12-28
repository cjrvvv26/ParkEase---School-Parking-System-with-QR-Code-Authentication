const axios = require("axios");

exports.searchMotorcycleImages = async (query) => {
  const googleURL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&searchType=image&key=${process.env.GOOGLE_CUSTOM_SEARCH_KEY}&cx=${
    process.env.SEARCH_ENGINE_ID
  }`;

  const response = await axios.get(googleURL);
  const images = response.data.items;

  if (!images || images.length === 0) {
    throw new Error("No images found");
  }

  return images.map((i) => i.link);
};
