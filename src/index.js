/* eslint-disable no-restricted-syntax */
const fs = require("fs");
const xml2js = require("xml2js");
const fixFields = require("./fieldFixers");
const fixGroupsAndConditions = require("./groupFixers");
const { addToReport, report, clearReport } = require("./report");

/* -------------------------------------------------------------------------- */
/*                              CONFIG VARIABLES                              */
/* -------------------------------------------------------------------------- */

// XML file paths
const inputXmlFolderPath = "./src/xml/input/";
const outputXmlPath = "./src/xml/output/";
const outputReportPath = "./src/xml/output/";

/* -------------------------------------------------------------------------- */
/*                                FILE HANDLING                               */
/* -------------------------------------------------------------------------- */

function getAllXMLFilePaths(path) {
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

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    // Write the file
    fs.writeFile(path, content, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("The file has been saved!");
      resolve();
    });
  });
}

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

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

function printReport(path, data) {
  let markdown = ``;

  data.forEach((value, key) => {
    // Add the subheader
    markdown += `${key}\n`;
    value.forEach((msg, i) => {
      if (msg) {
        // Add the message
        markdown += `${i + 1}. ${msg}\n`;
      }
    });
  });

  return writeFile(path, markdown);
}

async function processXmlFile(path) {
  const data = await readXmlFile(inputXmlFolderPath + path);
  const fileName = path.split(".")[0];
  const jsonData = await convertXmlToJson(data);
  const formEntity = jsonData.FormEntity;

  // Add the report header
  addToReport(`# ${fileName} Report`, "");

  // Analyze the XML and fix the fields
  jsonData.FormEntity = fixFields(formEntity);
  fixGroupsAndConditions(formEntity);

  // Convert the JSON back to XML
  const xml = convertJsonToXml(jsonData);

  // Create files
  const xmlPath = `${outputXmlPath + fileName}.xml`;
  const reportPath = `${outputReportPath + fileName}.md`;
  await printReport(reportPath, report);
  await writeFile(xmlPath, xml);
  clearReport();
}

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main() {
  const filePaths = await getAllXMLFilePaths("./src/xml/input");

  for (const path of filePaths) {
    // eslint-disable-next-line no-await-in-loop
    await processXmlFile(path);
  }

  console.log("finished!");
}

main();
