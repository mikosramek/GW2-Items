const { Select } = require("enquirer");

const {
  OUTPUT_FOLDER,
  OUTPUT_FILE_NAME,
  CATA_ID_FILE_NAME,
  CATA_NAME_FILE_NAME,
  CATA_RARITY_FILE_NAME,
  CURRENCY_OUTPUT_FILE,
  CATA_CURRENCY_ID_FILE_NAME,
  CATA_CURRENCY_NAME_FILE_NAME,
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

const catalogueCurrById = async (currData) => {
  Log.pending("Cataloging currencies by ID");
  const ids = {};
  currData.forEach((currency) => {
    const { id, ...rest } = currency;
    ids[id] = { ...rest };
  });
  try {
    await createJSONFile(
      `./${OUTPUT_FOLDER}/${CATA_CURRENCY_ID_FILE_NAME}.json`,
      ids
    );
    Log.success("Currency ID catalogue success");
  } catch (err) {
    Log.failure("Currency ID catalogue failed");
    console.error(err);
  }
};

const catalogueCurrByName = async (currData) => {
  Log.pending("Cataloging currencies by name");
  const names = {};
  currData.forEach((currency) => {
    const { name, ...rest } = currency;
    names[name] = { ...rest };
  });
  try {
    await createJSONFile(
      `./${OUTPUT_FOLDER}/${CATA_CURRENCY_NAME_FILE_NAME}.json`,
      names
    );
    Log.success("Currency name catalogue success");
  } catch (err) {
    Log.failure("Currency name catalogue failed");
    console.error(err);
  }
};

const choices = {
  ids: {
    m: "By IDs (object)",
    file: OUTPUT_FILE_NAME,
    f: catalogueByID,
  },
  name: {
    m: "By name (object)",
    file: OUTPUT_FILE_NAME,
    f: catalogueByName,
  },
  rarity: {
    m: "By rarity (arrays)",
    file: OUTPUT_FILE_NAME,
    f: catalogueByRarity,
  },
  "curr-ids": {
    m: "Currencies by IDs (object)",
    file: CURRENCY_OUTPUT_FILE,
    f: catalogueCurrById,
  },
  "curr-name": {
    m: "Currencies by name (object)",
    file: CURRENCY_OUTPUT_FILE,
    f: catalogueCurrByName,
  },
};

const prompt = new Select({
  name: "cataction",
  message: "How would you like to catalogue the data?",
  choices: Object.entries(choices).map(([id, value]) => ({
    message: value.m,
    name: id,
  })),
});

const catalogue = async () => {
  try {
    const answer = await prompt.run();
    const { file, f } = choices[answer];
    readFile(`./${OUTPUT_FOLDER}/${file}.json`, async (itemData) => {
      f(itemData);
    });
  } catch (err) {
    Log.failure(`cannot find "./${OUTPUT_FOLDER}/${OUTPUT_FILE_NAME}.json"`);
    console.error(err);
  }
};

module.exports = catalogue;
