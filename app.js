// Import the imagesHashHandler from the ImagesHashHandler module to work with image hashes
const { imagesHashHandler } = require('./ImagesHashHandler');

(async () => {
  try {
    // Define the path to the image you want to handle
    const imgPath = "./images/1.jpeg";

    // Calculate the hash of the image using the calculateImageHash method from imagesHashHandler
    const imgHash = await imagesHashHandler.calculateImageHash(imgPath);

    // Retrieve the existing image data from the JSON file
    const imagesData = await imagesHashHandler.readJsonData();
    // Check if the image hash already exists in the data retrieved
    const foundImage = imagesData.find(item => item.hash === imgHash);

    if (foundImage) {
      // If the image exists, log its details to the console
      console.log("Image already exists in JSON with the following details:", foundImage);
    } else {
      // Prepare image data with its path and calculated hash
      const imgData = { path: imgPath, hash: imgHash };
      // If the image does not exist, append the new image data to the JSON file
      await imagesHashHandler.appendJsonData(imgData);
      // Log a confirmation that new image data has been appended
      console.log("New image data appended to JSON.");
    }
  } catch (error) {
    // Log any errors that occur during the image hashing or JSON manipulation
    console.error("An error occurred:", error);
  }
})(); // End of self-invoking function
