"use strict";

const axios = require("axios");
const fs = require("fs");

const { pause } = require("./utils");

// TODO: use config file
const CALLS_PER_SESSION = 50;

const handleFileData = function (data) {
  // TODO: use config file
  readFile("./itemNames.json", (currentItems) => {
    const itemCalls = [];
    const newItems = [];
    let lastIDIndex = parseInt(currentItems.lastIDIndex);
    const itemLimit = lastIDIndex + CALLS_PER_SESSION;
    console.log("Going from", lastIDIndex, "to", itemLimit);
    for (let i = lastIDIndex; i < itemLimit; i += 1) {
      if (i < data.length) {
        const id = data[i];
        itemCalls.push(
          axios({
            method: "GET",
            url: `https://api.guildwars2.com/v2/items/${id}`,
            dataResponse: "json",
          })
        );
      }
    }
    lastIDIndex += CALLS_PER_SESSION;
    Promise.all(itemCalls)
      .then((itemData) => {
        itemData.forEach((response) => {
          const { data } = response;
          const { name, id, icon, rarity } = data;
          newItems.push({ name, id, icon, rarity });
        });
        currentItems.items = [...currentItems.items, ...newItems];
        currentItems.lastIDIndex = lastIDIndex;
        // TODO: use config file
        fs.writeFileSync(
          "./itemNames.json",
          JSON.stringify(currentItems, null, 2)
        );
        // TODO: use config file
        pause(() => handleFileData(data), 10000);
      })
      .catch((error) => {
        console.error(error);
        // TODO: use config file
        pause(() => handleFileData(data), 20000);
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
  // TODO: use config file
  readFile("./items.json", handleFileData);
};

module.exports = fetchItems;
