"use strict";

const axios = require("axios");
const fs = require("fs");

const { Log } = require("../utils");
const options = require("../config.json");
const { OUTPUT_FOLDER, CURRENCY_OUTPUT_FILE } = options;

const fetchCurrencies = function () {
  Log.pending(`fetching currencies`);
  Log.timestamp();

  const url = "https://api.guildwars2.com/v2/currencies?ids=all";

  axios
    .get(url)
    .then((response) => {
      const { data } = response;

      fs.writeFileSync(
        `./${OUTPUT_FOLDER}/${CURRENCY_OUTPUT_FILE}.json`,
        JSON.stringify(data, null, 2)
      );
      Log.success("currencies fetch successful");
    })
    .catch((err) => {
      Log.failure(`failed to fetch currency data`);
      console.error(err);
    });
};

module.exports = fetchCurrencies;
