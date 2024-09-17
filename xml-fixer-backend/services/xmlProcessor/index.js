/* eslint-disable prettier/prettier */

const path = require('path');
const xml2js = require('xml2js');
const fixFields = require('./fieldFixers');
const fixGroupsAndConditions = require('./groupFixers');
const { report, clearReport, generateReport } = require('./report');
const fileHelper = require('../../helpers/fileHelper');

const outputXmlPath = path.join(__dirname, `../..${process.env.OUTPUT_XML_PATH}`);
const outputReportPath = path.join(__dirname, `../..${process.env.OUTPUT_REPORT_PATH}`);

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
    return builder.buildObject(json);
}

module.exports = {
    processXmlFile: async (filePath) => {
        try {
            const data = await fileHelper.readFile(filePath, 'utf8');
            const fileName = path.basename(filePath, '.xml');

            const jsonData = await convertXmlToJson(data);
            const formEntity = jsonData.FormEntity;

            // Analyze and fix fields and groups
            jsonData.FormEntity = fixFields(formEntity);
            fixGroupsAndConditions(formEntity);

            const xml = convertJsonToXml(jsonData);

            // Construct paths for output XML and report files
            const xmlOutputPath = path.join(outputXmlPath, `${fileName}.xml`);
            const reportPath = path.join(outputReportPath, `${fileName}.md`);

            // Generate report data
            const reportData = await generateReport(report, fileName);

            // Write report and XML files using fileHelper
            await fileHelper.writeFile(reportPath, reportData);
            await fileHelper.writeFile(xmlOutputPath, xml);

            // Clear report after successful processing
            clearReport();

            console.log(`File processed: ${fileName}`);
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    },
};
