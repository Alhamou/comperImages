const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs').promises;

class FileHandler {

  constructor(filePath){
    this.filePath = filePath
  }

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

  async readJsonData() {
    await this.#verifyFilePresence(this.filePath);
    const data = await fs.readFile(this.filePath, 'utf8');
    return JSON.parse(data || '[]');
  }

  async appendJsonData(newData) {
    const existingData = await this.readJsonData(this.filePath);
    existingData.push(newData);
    const jsonContent = JSON.stringify(existingData, null, 2);
    await fs.writeFile(this.filePath, jsonContent, 'utf8');
  }

  async calculateImageHash(imagePath) {
    const imageBuffer = await sharp(imagePath).raw().toBuffer();
    return crypto.createHash('sha256').update(imageBuffer).digest('hex');
  }

}

(async () => {
  const fileMgr = new FileHandler("./temp/hashImagesStored.json");
  const imgPath = "./images/1.jpeg";


  const imgHash = await fileMgr.calculateImageHash(imgPath);
  const imgData = { path: imgPath, hash: imgHash };

  const imagesData = await fileMgr.readJsonData();
  const foundImage = imagesData.find(item => item.hash === imgHash);

  if (foundImage) {
    console.log("Image already exists in JSON:", foundImage);
  } else {
    await fileMgr.appendJsonData(imgData);
    console.log("New image data appended to JSON.");
  }
})();
