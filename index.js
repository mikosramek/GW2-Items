"use strict";

const { Select, Confirm } = require("enquirer");
const axios = require("axios");
const options = require("./config.json");
const { OUTPUT_FOLDER, ID_FILE_NAME, OUTPUT_FILE_NAME, CURRENCY_OUTPUT_FILE } =
  options;
const { createJSONFile, Log } = require("./utils");
const fetchItems = require("./fetchItems");
const catalogue = require("./catalogueItems");
const fetchCurrencies = require("./currency/fetch");

const prompt = new Select({
  name: "action",
  message: "What action would you like to perform?",
  choices: [
    "Setup data folder and files",
    "Clear IDs",
    "Fetch IDs",
    "Clear data",
    "Fetch data",
    "Clear currencies",
    "Fetch currencies",
    "Catalogue data",
    // "View options",
    // "Update options",
  ],
});

const destructionConfirmation = new Confirm({
  name: "question",
  message: "This action will clear existing files. Continue?",
});

// Setup
const setup = async () => {
  const answer = await destructionConfirmation.run();
  Log.title("\nSetting up data");
  if (answer) {
    await clearIDs(true);
    await clearData(true);
    await clearCurrencies(true);
    Log.success("data setup");
  }
};

// IDs
const clearIDs = async (bypassConfirmation = false) => {
  try {
    const answer = bypassConfirmation || (await destructionConfirmation.run());
    if (answer) {
      Log.pending("IDs being cleared");
      await createFolder(OUTPUT_FOLDER);
      await createJSONFile(`./${OUTPUT_FOLDER}/${ID_FILE_NAME}.json`, []);
      Log.success("IDs cleared");
    }
  } catch (err) {
    Log.failure("IDs couldn't be cleared");
    console.error(err);
  }
};
const fetchIDs = async () => {
  try {
    Log.pending("fetching ids");
    const response = await axios.get("https://api.guildwars2.com/v2/items", {
      dataResponse: "json",
    });
    const { data: ids } = response;
    Log.success("ids fetched");
    Log.pending("writing ids to file");
    await createJSONFile(`./${OUTPUT_FOLDER}/${ID_FILE_NAME}.json`, ids);
    Log.success(
      `ids written to file (./${OUTPUT_FOLDER}/${ID_FILE_NAME}.json)`
    );
  } catch (err) {
    Log.failure("id couldn't be fetched");
    console.error(err);
  }
};

// Data
const clearData = async (bypassConfirmation = false) => {
  try {
    const answer = bypassConfirmation || (await destructionConfirmation.run());
    if (answer) {
      Log.pending("data being cleared");
      await createFolder(OUTPUT_FOLDER);
      await createJSONFile(`./${OUTPUT_FOLDER}/${OUTPUT_FILE_NAME}.json`, {
        lastIDIndex: 0,
        items: [],
      });
      Log.success("data cleared");
    }
  } catch (err) {
    Log.failure("data couldn't be cleared");
    console.error(err);
  }
};

// Currencies
const clearCurrencies = async (bypassConfirmation = false) => {
  try {
    const answer = bypassConfirmation || (await destructionConfirmation.run());
    if (answer) {
      Log.pending("currency data being cleared");
      await createFolder(OUTPUT_FOLDER);
      await createJSONFile(
        `./${OUTPUT_FOLDER}/${CURRENCY_OUTPUT_FILE}.json`,
        []
      );
      Log.success("currency data cleared");
    }
  } catch (err) {
    Log.failure("currency data couldn't be cleared");
    console.error(err);
  }
};

const fetchData = () => {
  // fetch items
  try {
    Log.pending("fetching data");
    fetchItems();
  } catch (err) {
    Log.failure("data couldn't be fetched");
  }
};

// Options
const viewOptions = () => {};
const updateOptions = () => {};

const main = async () => {
  console.clear();
  try {
    const action = await prompt.run();
    switch (action) {
      case "Setup data folder and files":
        setup();
        break;
      case "Clear IDs":
        await clearIDs();
        break;
      case "Fetch IDs":
        fetchIDs();
        break;
      case "Clear data":
        await clearData();
        break;
      case "Fetch data":
        fetchData();
        break;
      case "Clear currencies":
        clearCurrencies();
        break;
      case "Fetch currencies":
        fetchCurrencies();
        break;
      case "Catalogue data":
        catalogue();
        break;
      // case "View options":
      //   viewOptions();
      //   break;
      // case "Update options":
      //   updateOptions();
      //   break;
      default:
        console.log("No valid option selected");
        break;
    }
  } catch (e) {
    console.log("Exiting");
  }
};

main();
