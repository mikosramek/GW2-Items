const fs = require("fs");
const chalk = require("chalk");

const timeout = (time) => new Promise((res) => setTimeout(res, time));

const updatePauseTime = (time, current, total) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`… pausing for ${time}ms (${(current / total) * 100}%)`);
};

const pause = (callback, time) => {
  const fragmentCount = 10;
  const timeFragment = time / fragmentCount;
  let current = 0;
  updatePauseTime(time, current, fragmentCount);
  const interval = setInterval(() => {
    current += 1;
    updatePauseTime(time, current, fragmentCount);
    if (current >= fragmentCount) {
      clearInterval(interval);
      process.stdout.write("\n");
      callback();
    }
  }, timeFragment);
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

const readFile = (path, callback) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) throw err;
    callback(JSON.parse(data));
  });
};

class Log {
  pending(copy) {
    console.log(chalk.yellow("…"), copy);
  }
  success(copy) {
    console.log(chalk.green("✔"), copy);
  }
  failure(copy) {
    console.log(chalk.red("𐄂"), copy);
  }
  title(copy) {
    console.log(chalk.black.bgWhite(copy));
  }
  timestamp() {
    console.log(chalk.gray(`⏰ ${new Date().toLocaleTimeString()}`));
  }
}

module.exports = {
  pause,
  createJSONFile,
  Log: new Log(),
  readFile,
};
