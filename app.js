// Import the imagesHashHandler from the ImagesHashHandler module to work with image hashes
const { imagesHashHandler } = require('./ImagesHashHandler')

// Self-invoking async function to use await at the top level
;(async () => {

  // Define the path to the image you want to handle
  const imgPath = "./images/1.jpeg";

  // Calculate the hash of the image using the calculateImageHash method from imagesHashHandler
  const imgHash = await imagesHashHandler.calculateImageHash(imgPath);
  // Prepare image data with its path and calculated hash
  const imgData = { path: imgPath, hash: imgHash };

  // Retrieve the existing image data from the JSON file
  const imagesData = await imagesHashHandler.readJsonData();
  // Check if the image hash already exists in the data retrieved
  const foundImage = imagesData.find(item => item.hash === imgHash);

  // If the image exists, log it to the console
  if (foundImage) {
    console.log("Image already exists in JSON:", foundImage);
  } else {
    // If the image does not exist, append the new image data to the JSON file
    await imagesHashHandler.appendJsonData(imgData);
    // Log a confirmation that new image data has been appended
    console.log("New image data appended to JSON.");
  }
})(); // End of self-invoking function
