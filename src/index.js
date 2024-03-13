const fs = require("fs");
const xml2js = require("xml2js");
const fixFields = require("./fieldFixers");
const fixGroupsAndConditions = require("./groupFixers");

/* -------------------------------------------------------------------------- */
/*                              CONFIG VARIABLES                              */
/* -------------------------------------------------------------------------- */

// XML file paths
const inputXmlPath = "./src/xml/input/";
const outputXmlPath = "./src/xml/output/form.xml";

/* -------------------------------------------------------------------------- */
/*                                FILE HANDLING                               */
/* -------------------------------------------------------------------------- */

function readXmlFile(inputXmlPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputXmlPath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

function convertXmlToJson(data) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function convertJsonToXml(json) {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(json);
  return xml;
}

function writeFile(outputXmlPath, xml) {
  return new Promise((resolve, reject) => {
    // Write the XML back to the file
    fs.writeFile(outputXmlPath, xml, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("The file has been saved!");
      resolve();
    });
  });
}

function getAllXMLFilesPaths(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      // Filter out non-XML files
      const xmlFiles = files.filter((file) => file.endsWith(".xml"));
      resolve(xmlFiles);
    });
  });
}

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main() {
  const filePaths = await getAllXMLFilesPaths("./src/xml/input");
  const xmlData = await readXmlFile(inputXmlPath + filePaths[0]);
  const jsonData = await convertXmlToJson(xmlData);

  // Apply fixes to the JSON object
  // jsonData.FormEntity = fixFields(jsonData.FormEntity);

  fixGroupsAndConditions(jsonData.FormEntity);

  // Convert the result object back to XML
  const xml = convertJsonToXml(jsonData);
  await writeFile(outputXmlPath, xml);

  console.log("finished!");
}

main();
