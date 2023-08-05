const fs = require("fs");

const timeout = (time) => new Promise((res) => setTimeout(res, time));

const pause = async (callback, time) => {
  await timeout(time);
  callback();
};

createFolder = (filePath) => {
  return new Promise((res, rej) => {
    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) return rej(err);
      else res();
    });
  });
};

createJSONFile = (filePath, data = {}) => {
  return new Promise((res, rej) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return rej(err);
      else res();
    });
  });
};

module.exports = {
  pause,
  createJSONFile,
};
