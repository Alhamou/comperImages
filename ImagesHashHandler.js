// Import required modules: sharp for image processing, crypto for hashing, fs for file system operations
const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs').promises;

// Define imagesHashHandler as an IIFE to encapsulate and manage image hash operations
const imagesHashHandler = (function() {
  // Initialize an object to hold our public methods
  const obj = {};

  // Define the file path for storing our hash images JSON
  const filePath = "./temp/hashImagesStored.json";

  // Method to verify the presence of a file and create it if it does not exist
  const verifyFilePresence = async function(targetPath) {
    try {
      await fs.access(targetPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(targetPath, '[]', 'utf-8'); // Initialize with an empty array
      } else {
        console.error(`Error accessing file at ${targetPath}:`, error);
        throw error;
      }
    }
  };

  // Method to read JSON data from a file, ensuring the file exists beforehand
  obj.readJsonData = async function() {
    await verifyFilePresence(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  };

  // Method to append new data to our JSON file, including reading and writing to the file
  obj.appendJsonData = async function(newData) {
    const existingData = await this.readJsonData();
    existingData.push(newData);
    const jsonContent = JSON.stringify(existingData, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf8');
  };

  // Method to calculate the hash of an image using SHA-256 algorithm
  obj.calculateImageHash = async function(imagePath) {
    const imageBuffer = await sharp(imagePath).raw().toBuffer();
    return crypto.createHash('sha256').update(imageBuffer).digest('hex');
  };

  // Return our object with the public methods to be used outside this IIFE
  return obj;
})();

// Export imagesHashHandler module for use in other parts of the application
module.exports = { imagesHashHandler };
