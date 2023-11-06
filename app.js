const {imagesHashHandler} = require('./ImagesHashHandler')

;(async () => {

  const imgPath = "./images/1.jpeg";

  const imgHash = await imagesHashHandler.calculateImageHash(imgPath);
  const imgData = { path: imgPath, hash: imgHash };

  const imagesData = await imagesHashHandler.readJsonData();
  const foundImage = imagesData.find(item => item.hash === imgHash);

  if (foundImage) {
    console.log("Image already exists in JSON:", foundImage);
  } else {
    await imagesHashHandler.appendJsonData(imgData);
    console.log("New image data appended to JSON.");
  }
})();
