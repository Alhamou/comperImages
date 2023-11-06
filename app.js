const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs').promises;

class FileHandler {

  async #verifyFilePresence(targetPath) {
    try {
      await fs.access(targetPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(targetPath, '', 'utf-8');
      } else {
        console.error(`Error accessing file at ${targetPath}:`, error);
        throw error;
      }
    }
  }

  async readJsonData(filePath) {
    await this.#verifyFilePresence(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  }

  async appendJsonData(filePath, newData) {
    const existingData = await this.readJsonData(filePath);
    existingData.push(newData);
    const jsonContent = JSON.stringify(existingData, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf8');
  }

  async calculateImageHash(imagePath) {
    const imageBuffer = await sharp(imagePath).raw().toBuffer();
    return crypto.createHash('sha256').update(imageBuffer).digest('hex');
  }

}

(async () => {
  const fileMgr = new FileHandler();
  const imgPath = "./images/1.jpeg";
  const jsonFilePath = "./temp/hashImagesStored.json";

  const imgHash = await fileMgr.calculateImageHash(imgPath);
  const imgData = { path: imgPath, hash: imgHash };

  const imagesData = await fileMgr.readJsonData(jsonFilePath);
  const foundImage = imagesData.find(item => item.hash === imgHash);

  if (foundImage) {
    console.log("Image already exists in JSON:", foundImage);
  } else {
    await fileMgr.appendJsonData(jsonFilePath, imgData);
    console.log("New image data appended to JSON.");
  }
})();
