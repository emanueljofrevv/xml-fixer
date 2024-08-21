/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const fixFields = require('./fieldFixers');
const fixGroupsAndConditions = require('./groupFixers');
const { addToReport, report, clearReport, generateReport } = require('./report');

const outputXmlPath = process.env.OUTPUT_XML_PATH;
const outputReportPath = process.env.OUTPUT_REPORT_PATH;

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

module.exports = {
    processXmlFile: async (filePath) => {
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
    },
};
