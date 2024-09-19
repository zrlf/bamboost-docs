import fs from "fs";
import path from "path";

// Path to the Nextra search index
const nextraIndexPath = path.join(
  "out",
  "_next",
  "static",
  "chunks",
  "nextra-data-en-US.json",
);
const customDataPath = path.join("extract-docs", "data", "source_docs.json");
const prefix = "/apidocs/";

// Load existing search index
let nextraIndex = [];

if (fs.existsSync(nextraIndexPath)) {
  nextraIndex = JSON.parse(fs.readFileSync(nextraIndexPath, "utf8"));
} else {
  console.error("Nextra search index not found. Build the project first.");
  process.exit(1);
}

// Load your custom data
if (!fs.existsSync(customDataPath)) {
  console.error("Custom data not found. Run the extract-docs script first.");
  process.exit(1);
}
let customData = [];
customData = JSON.parse(fs.readFileSync(customDataPath, "utf8"));

// Transform custom data into search index format
const extractPage = (page, data) => {
  // submodules
  for (const submodule of page.submodules) {
    extractPage(submodule, data);
  }

  const slug = prefix + (page.slug[0] === 'bamboost' ? page.slug.slice(1).join("/") : page.slug.join("/"));
  console.log("indexing slug: ", page.slug, slug);
  const pageData = {};

  // docstring
  pageData[`${page.name}#${page.name}`] = page.docstring;

  // classes
  page.classes.forEach((cls) => {
    pageData[`${cls.name}#${cls.name}`] = cls.docstring;
    Object.entries(cls.methods).forEach(([name, method]) => {
      const allStrings = [
        method.docstring,
        ...Object.entries(method.arguments).map(([argName, arg]) => 
          `${argName}\n${arg.description ? arg.description + '\n' : ''}`
        )
      ].join('');
      // Change this if header structure is changed
      pageData[`${cls.name}.${name}#${cls.name}.${name}`] = allStrings;
    });
  });

  data[slug] = {
    title: page.name,
    data: pageData,
  };
};

const customIndexEntries = customData.submodules.map((page) => {
  let data = {};
  extractPage(page, data);
  return data;
});

const customEntriesCombined = customIndexEntries.reduce((acc, curr) => {
  return { ...acc, ...curr };
}, {});

// Append custom entries to the Nextra index
const updatedIndex = { ...nextraIndex, ...customEntriesCombined };

// Write the updated index back to the file
fs.writeFileSync(nextraIndexPath, JSON.stringify(updatedIndex, null, 2));

// copy the original index to a backup file
// fs.writeFileSync(
//   nextraIndexPath + ".bak",
//   JSON.stringify(nextraIndex, null, 2),
// );

console.log("Source documentation added to the Nextra search index.");
