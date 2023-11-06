const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs').promises;

const imagesHashHandler = (function(){

  const obj = {}

  const filePath = "./temp/hashImagesStored.json"

  obj.verifyFilePresence = async function (targetPath) {
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

  obj.readJsonData = async function() {
    await this.verifyFilePresence(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  }

  obj.appendJsonData = async function(newData) {
    const existingData = await this.readJsonData(filePath);
    existingData.push(newData);
    const jsonContent = JSON.stringify(existingData, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf8');
  }

  obj.calculateImageHash = async function(imagePath) {
    const imageBuffer = await sharp(imagePath).raw().toBuffer();
    return crypto.createHash('sha256').update(imageBuffer).digest('hex');
  }

  return obj;
})()



module.exports = {imagesHashHandler}
