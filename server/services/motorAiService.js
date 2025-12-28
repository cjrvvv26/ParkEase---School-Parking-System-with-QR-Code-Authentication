const { generateMotorcycleData } = require("./geminiService");
const { searchMotorcycleImages } = require("./googleImageService");

exports.customizeMotorcyclePrompt = async (input) => {
  const correctedData = await generateMotorcycleData(input);
  const images = await searchMotorcycleImages(correctedData.search_query);

  return {
    corrected: correctedData,
    imageUrl: images[0],
    allImages: images,
  };
};
