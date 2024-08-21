/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const xmlProcessor = require('../services/xmlProcessor');

const uploadDir = process.env.UPLOAD_DIR;

module.exports = {
    upload: (req, res) => {
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

                await xmlProcessor.processXmlFile(newFilePath);

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('File uploaded and processed successfully');
            });
        });
    },
};
