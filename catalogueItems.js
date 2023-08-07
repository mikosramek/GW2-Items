const { Select } = require("enquirer");

const {
  OUTPUT_FOLDER,
  OUTPUT_FILE_NAME,
  CATA_ID_FILE_NAME,
  CATA_NAME_FILE_NAME,
  CATA_RARITY_FILE_NAME,
} = require("./config.json");
const { Log, readFile, createJSONFile } = require("./utils");

const catalogueByID = async (itemData) => {
  Log.pending("Cataloging items by ID");
  const { items } = itemData;
  const ids = {};
  items.forEach((item) => {
    const { id, ...rest } = item;
    ids[id] = { ...rest };
  });
  try {
    await createJSONFile(`./${OUTPUT_FOLDER}/${CATA_ID_FILE_NAME}.json`, ids);
    Log.success("ID catalogue success");
  } catch (err) {
    Log.failure("ID catalogue failed");
    console.error(err);
  }
};

const catalogueByName = async (itemData) => {
  Log.pending("Cataloging items by name");
  const { items } = itemData;
  const names = {};
  items.forEach((item) => {
    const { name, ...rest } = item;
    names[name] = { ...rest };
  });
  try {
    await createJSONFile(
      `./${OUTPUT_FOLDER}/${CATA_NAME_FILE_NAME}.json`,
      names
    );
    Log.success("Name catalogue success");
  } catch (err) {
    Log.failure("Name catalogue failed");
    console.error(err);
  }
};

const catalogueByRarity = async (itemData) => {
  Log.pending("Cataloging items by rarity");
  const { items } = itemData;
  const rarities = {};
  items.forEach((item) => {
    const { rarity, ...rest } = item;
    if (rarities[rarity]) {
      rarities[rarity].push({ ...rest });
    } else {
      rarities[rarity] = [{ ...rest }];
    }
  });
  try {
    await createJSONFile(
      `./${OUTPUT_FOLDER}/${CATA_RARITY_FILE_NAME}.json`,
      rarities
    );
    Log.success("Rarity catalogue success");
  } catch (err) {
    Log.failure("Rarity catalogue failed");
    console.error(err);
  }
};

const prompt = new Select({
  name: "cataction",
  message: "How would you like to catalogue the data?",
  choices: [
    { message: "By IDs (object)", name: "ids" },
    { message: "By name (object)", name: "name" },
    { message: "By rarity (arrays)", name: "rarity" },
  ],
});

const catalogue = async () => {
  try {
    readFile(
      `./${OUTPUT_FOLDER}/${OUTPUT_FILE_NAME}.json`,
      async (itemData) => {
        const answer = await prompt.run();
        switch (answer) {
          case "ids":
            catalogueByID(itemData);
            break;
          case "name":
            catalogueByName(itemData);
            break;
          case "rarity":
            catalogueByRarity(itemData);
            break;
          default:
            Log.failure("choice not valid");
            break;
        }
      }
    );
  } catch (err) {
    Log.failure(`cannot find "./${OUTPUT_FOLDER}/${OUTPUT_FILE_NAME}.json"`);
    console.error(err);
  }
};

module.exports = catalogue;
