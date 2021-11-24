/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const { resolve } = require("path");
const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const unzip = (pathIn, pathOut) => {
  return fs.createReadStream(pathIn)
  .pipe(unzipper.Extract({ path: pathOut }))
  .promise()

};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    let paths = []
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      } else {
        files.forEach(file => {
          paths.push(path.join("/",dir,file))
        })
        resolve(paths)
      }
    }) 
  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {

  fs.createReadStream(pathIn)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        let total = (this.data[idx] + this.data[idx+1] + this.data[idx+2]) / 3
        // invert color
        this.data[idx] = total;
        this.data[idx + 1] = total;
        this.data[idx + 2] = total;
 
        // and reduce opacity
        this.data[idx + 3] = this.data[idx + 3] >> 1;
      }
    }
    let num = Math.floor((Math.random() * 100000) + 1);
    this.pack().pipe(fs.createWriteStream(`${pathOut}/out_${num}.png`));
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
