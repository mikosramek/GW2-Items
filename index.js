'use strict'

const axios = require('axios');
const fs = require('fs');
const { Console } = require('console');

const CALLS_PER_SESSION = 50;

const handleFileData = function(data) {
  readFile('./itemNames.json', (currentItems) => {
    const itemCalls = [];
    const newItems = [];
    let lastIDIndex = parseInt(currentItems.lastIDIndex);
    const itemLimit = lastIDIndex + CALLS_PER_SESSION;
    console.log('Going from', lastIDIndex , 'to', itemLimit);
    for (let i = lastIDIndex; i < itemLimit; i += 1) {
      if (i < data.length) {
        const id = data[i];
        itemCalls.push(axios({
          method: 'GET',
          url: `https://api.guildwars2.com/v2/items/${id}`,
          dataResponse: 'json'
        }));
      }
    }
    lastIDIndex += CALLS_PER_SESSION;
    Promise.all(itemCalls).then(itemData => {
      itemData.forEach(response => {
        const { data } = response;
        const { name, id, icon, rarity } = data;
        newItems.push({name, id, icon, rarity});
      })
      currentItems.items = [ ...currentItems.items, ...newItems ];
      currentItems.lastIDIndex = lastIDIndex;
      fs.writeFileSync('./itemNames.json', JSON.stringify(currentItems, null, 2));
      pause(data, handleFileData, 10000);
    }).catch(error => {
      console.error(error);
      pause(data, handleFileData, 20000);
    });
  });
};

const timeout = (time) => new Promise((res, rej) => setTimeout(res, time));

const pause = async(data, callback, time) => {
  await timeout(time);
  callback(data);
}


const readFile = (path, callback) => {
  fs.readFile(
    path,
    'utf-8',
    (err, data) => {
      if(err) throw err;
      callback(JSON.parse(data));
    }
  );
};

readFile('./items.json', handleFileData);
