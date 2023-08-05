"use strict";

const { Select, Confirm } = require("enquirer");
const {
  OUTPUT_FOLDER,
  ID_FILE_NAME,
  OUTPUT_FILE_NAME,
} = require("./config.json");
const { createJSONFile } = require("./utils");
const fetchItems = require("./fetchItems");

const prompt = new Select({
  name: "action",
  message: "What action would you like to perform?",
  choices: [
    "Setup data folder and files",
    "Clear IDs",
    "Fetch IDs",
    "Clear data",
    "Fetch data",
    "View options",
    "Update options",
  ],
});

const destructionConfirmation = new Confirm({
  name: "question",
  message: "This action will overwrite existing files. Continue?",
});

const setup = async () => {
  const answer = await destructionConfirmation.run();
  if (answer) {
    await clearIDs(true);
    await clearData(true);
  }
};

// IDs
const clearIDs = async (bypassConfirmation = false) => {
  try {
    const answer = bypassConfirmation || (await destructionConfirmation.run());
    if (answer) {
      await createFolder(OUTPUT_FOLDER);
      await createJSONFile(`./${OUTPUT_FOLDER}/${ID_FILE_NAME}.json`, []);
    }
  } catch (err) {
    console.error(err);
  }
};
const fetchIDs = () => {};

// Data
const clearData = async (bypassConfirmation = false) => {
  try {
    const answer = bypassConfirmation || (await destructionConfirmation.run());
    if (answer) {
      await createFolder(OUTPUT_FOLDER);
      await createJSONFile(`./${OUTPUT_FOLDER}/${OUTPUT_FILE_NAME}.json`, {
        lastIDIndex: 0,
        items: [],
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchData = () => {};

// Options
const viewOptions = () => {};
const updateOptions = () => {};

const main = async () => {
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
      case "View options":
        viewOptions();
        break;
      case "Update options":
        updateOptions();
        break;
      default:
        console.log("No valid option selected");
        break;
    }
  } catch (e) {
    console.log("Exiting");
  }
};

main();
