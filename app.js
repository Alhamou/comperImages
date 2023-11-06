// Import the imagesHashHandler from the ImagesHashHandler module to work with image hashes
const { imagesHashHandler } = require('./ImagesHashHandler');

(async () => {
  try {
    // Define the path to the image you want to handle
    const imgPath = "./images/1.jpeg";

    // Check if the image hash already exists in the data retrieved
    const {item, jsonContent, imgHash} = await imagesHashHandler.findJsonData(imgPath);

    if (item) {
      // If the image exists, log its details to the console
      console.log("Image already exists in JSON with the following details:", item);
    } else {
      // If the image does not exist, append the new image data to the JSON file
      await imagesHashHandler.appendJsonData(imgPath, imgHash, jsonContent);
      // Log a confirmation that new image data has been appended
      console.log("New image data appended to JSON.");
    }
  } catch (error) {
    // Log any errors that occur during the image hashing or JSON manipulation
    console.error("An error occurred:", error);
  }
})(); // End of self-invoking function
