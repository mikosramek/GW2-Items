"use strict";

const axios = require("axios");
const fs = require("fs");

const { pause, Log } = require("./utils");
const options = require("./config.json");
const {
  OUTPUT_FOLDER,
  ID_FILE_NAME,
  OUTPUT_FILE_NAME,
  CALLS_PER_SESSION,
  TIMEOUT_BETWEEN_CALLS,
  TIMEOUT_BETWEEN_ERROR,
} = options;

const handleFileData = function (data) {
  readFile(`./${OUTPUT_FOLDER}/${OUTPUT_FILE_NAME}.json`, (currentItems) => {
    const newItems = [];
    let lastIDIndex = parseInt(currentItems.lastIDIndex);
    const itemLimit = lastIDIndex + CALLS_PER_SESSION;
    Log.pending(`fetching from ${lastIDIndex} to ${itemLimit}`);
    Log.timestamp();
    const ids = [];
    for (let i = lastIDIndex; i < itemLimit; i += 1) {
      if (i < data.length) {
        const id = data[i];
        ids.push(id);
      } else {
        Log.success("all items have been fetched");
        return;
      }
    }

    lastIDIndex += CALLS_PER_SESSION;

    const url = `https://api.guildwars2.com/v2/items?ids=${ids.toString()}`;
    axios
      .get(url)
      .then((response) => {
        const { data: items } = response;
        items.forEach((item) => {
          const { name, id, icon, rarity } = item;
          newItems.push({ name, id, icon, rarity });
        });
        currentItems.items = [...currentItems.items, ...newItems];
        currentItems.lastIDIndex = lastIDIndex;
        fs.writeFileSync(
          `./${OUTPUT_FOLDER}/${OUTPUT_FILE_NAME}.json`,
          JSON.stringify(currentItems, null, 2)
        );
        Log.success(
          `item data fetch successful - ${
            data.length - lastIDIndex
          } items remain`
        );
        pause(() => handleFileData(data), TIMEOUT_BETWEEN_CALLS);
      })
      .catch((err) => {
        Log.failure(`failed to fetch item data, retrying (${lastIDIndex})`);
        console.error(err);
        pause(() => handleFileData(data), TIMEOUT_BETWEEN_ERROR);
      });
  });
};

const readFile = (path, callback) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) throw err;
    callback(JSON.parse(data));
  });
};

const fetchItems = () => {
  readFile(`./${OUTPUT_FOLDER}/${ID_FILE_NAME}.json`, handleFileData);
};

module.exports = fetchItems;
