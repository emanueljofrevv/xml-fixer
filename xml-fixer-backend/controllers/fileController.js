/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const xmlProcessor = require('../services/xmlProcessor');

const uploadDir = process.env.UPLOAD_DIR;
const outputDir = process.env.OUTPUT_XML_PATH;
const fsPromises = fs.promises; // Use fs.promises for better handling

function encodeFilename(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // Remove any trailing '=' padding
}

function decodeFilename(encoded) {
    // Add back missing padding before decoding
    encoded = encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=');
    return Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

// TODO: properly handle errors in this controller
module.exports = {
    uploadFile: (req, res) => {
        try {
            const form = new formidable.IncomingForm();
            form.uploadDir = uploadDir;
            form.keepExtensions = true;

            form.parse(req, (error, fields, files) => {
                if (error) {
                    res.status(500).send('Error in file upload');
                    return;
                }

                console.log(files);

                const file = files.xmlFile[0];
                const filePath = file.filepath;
                const encodedFileName = encodeFilename(
                    `${file.newFilename}:${file.originalFilename.replace('.xml', '')}`
                );
                const newFilePath = path.join(uploadDir, encodedFileName);

                fs.rename(filePath, newFilePath, async (renameError) => {
                    if (renameError) {
                        res.status(500).send('Error in moving file');
                        return;
                    }

                    await xmlProcessor.processXmlFile(newFilePath);

                    res.status(200).send('File uploaded and processed successfully');
                });
            });
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getAllFiles: (req, res) => {
        try {
            fs.readdir(uploadDir, (readdirError, fileNames) => {
                if (readdirError) {
                    res.status(500).send('Error reading input folder');
                    return;
                }

                const filePromises = fileNames.map(
                    (fileName) =>
                        new Promise((resolve, reject) => {
                            const filepath = path.resolve(uploadDir, fileName);
                            fs.stat(filepath, (error, stat) => {
                                if (error) {
                                    // eslint-disable-next-line prefer-promise-reject-errors
                                    reject('Error getting information about the file');
                                    return;
                                }

                                const [uniqueHash, originalFileName] =
                                    decodeFilename(fileName).split(':');

                                if (stat.isFile()) {
                                    resolve({
                                        id: fileName,
                                        originalFileName,
                                        createDate: stat.ctime,
                                    });
                                } else {
                                    resolve(null); // skip folders
                                }
                            });
                        })
                );

                Promise.all(filePromises)
                    .then((results) => {
                        const files = results.filter((file) => file !== null); // filter out null values
                        res.status(200).json(files);
                    })
                    .catch((filePromisesError) => {
                        throw filePromisesError;
                    });
            });
        } catch (error) {
            res.status(500).send(error);
        }
    },

    getFile: async (req, res) => {
        try {
            const { fileName } = req.params;
            const filepath = path.resolve(outputDir, `${fileName}.md`);

            const fileExists = await fsPromises.stat(filepath).catch(() => null);
            if (!fileExists) {
                return res.status(404).send('File not found');
            }

            const data = await fsPromises.readFile(filepath, 'utf8');
            return res.status(200).send(data);
        } catch (error) {
            console.error('Error reading file:', error);
            return res.status(500).send('Error retrieving file');
        }
    },
};
