// Import required modules: sharp for image processing, crypto for hashing, fs for file system operations
const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs').promises;
const { exec } = require('child_process');

// Define imagesHashHandler as an IIFE to encapsulate and manage image hash operations
const imagesHashHandler = (function() {
  // Initialize an object to hold our public methods
  const obj = {};

  // Define the file path for storing our hash images JSON
  const filePath = "/Users/work/Developer/comperImages/temp/file.txt";

  // Method to verify the presence of a file and create it if it does not exist
  const verifyFilePresence = async function() {
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(filePath, '', 'utf-8'); // Initialize with an empty array
      } else {
        console.error(`Error accessing file at ${filePath}:`, error);
        throw error;
      }
    }
  };

  // Method to read JSON data from a file, ensuring the file exists beforehand
  obj.findOneImage = async function(imgPathIs) {
    await verifyFilePresence()
    const imgHash = await obj.calculateImageHash(imgPathIs);
    const imgPath = await obj.findImagePathByHash(imgHash)
    return {imgHash, imgPath}
  };

  obj.findImagePathByHash = function(imagHash){

    return new Promise(function(resolve, reject){

      exec('grep -o "'+imagHash+':[^:]*" /Users/work/Developer/comperImages/temp/file.txt | cut -d":" -f2', (error, stdout, stderr) => {
          if (error) {
              reject(error);
          }

          if (stderr) {
              reject(stderr);
          }

          resolve(stdout.replace(/\n/, ""))
      })
    })

  }

  obj.addNewImageAndHash = function(data){
    return new Promise(function(resolve, reject){
      exec(`echo ${data} >> ${'/Users/work/Developer/comperImages/temp/file.txt'}`, (error, stdout, stderr) => {
        if (error) {
            reject(error)
        }
        if (stderr) {
            reject(stderr)
        }
        resolve(null)
    })
  });
  }

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
