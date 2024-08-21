/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const fixFields = require('../services/xmlProcessor/fieldFixers');
const fixGroupsAndConditions = require('../services/xmlProcessor/groupFixers');
const {
  addToReport,
  report,
  clearReport,
  generateReport,
} = require('../services/xmlProcessor/report');

/* -------------------------------------------------------------------------- */
/*                              CONFIG VARIABLES                              */
/* -------------------------------------------------------------------------- */

// XML file paths
const uploadDir = './public/input/';
const outputXmlPath = './public/output/';
const outputReportPath = './public/output/';

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function readXmlFile(inputXmlPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputXmlPath, 'utf-8', (err, data) => {
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
    fs.writeFile(path, content, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('The file has been saved!');
      resolve();
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

async function processXmlFile(filePath) {
  try {
    const data = await readXmlFile(filePath);
    const fileName = path.basename(filePath, '.xml');
    const jsonData = await convertXmlToJson(data);
    const formEntity = jsonData.FormEntity;

    // Analyze the XML and fix the fields
    jsonData.FormEntity = fixFields(formEntity);
    fixGroupsAndConditions(formEntity);

    // Convert the JSON back to XML
    const xml = convertJsonToXml(jsonData);

    // Create files
    const xmlOutputPath = path.join(outputXmlPath, `${fileName}.xml`);
    const reportPath = path.join(outputReportPath, `${fileName}.md`);
    const reportData = await generateReport(report, fileName);
    await writeFile(reportPath, reportData);
    await writeFile(xmlOutputPath, xml);
    clearReport();

    console.log(`File processed: ${fileName}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

/* -------------------------------------------------------------------------- */
/*                                    SERVER                                  */
/* -------------------------------------------------------------------------- */

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method.toLowerCase() === 'options') {
      res.writeHead(204);
      res.end();
      return;
  }

  if (req.method.toLowerCase() === 'post' && req.url === '/upload') {
      const form = new formidable.IncomingForm();
      form.uploadDir = uploadDir;
      form.keepExtensions = true;

      form.parse(req, (err, fields, files) => {
          if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Error in file upload');
              return;
          }

          console.log(files);

          const file = files.xmlFile[0];
          const filePath = file.filepath;
          const newFilePath = path.join(uploadDir, file.newFilename);

          fs.rename(filePath, newFilePath, async (err) => {
              if (err) {
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Error in moving file');
                  return;
              }

              await processXmlFile(newFilePath);

              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end('File uploaded and processed successfully');
          });
      });
  } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
