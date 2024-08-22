/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const formidable = require('formidable');
const path = require('path');
const xmlProcessor = require('../services/xmlProcessor');
const fileHelper = require('../helpers/fileHelper');

const uploadDir = process.env.UPLOAD_DIR;
const outputDir = process.env.OUTPUT_XML_PATH;

module.exports = {
    uploadFile: (req, res) => {
        try {
            const form = new formidable.IncomingForm();
            form.uploadDir = uploadDir;
            form.keepExtensions = true;

            form.parse(req, async (error, fields, files) => {
                if (error) {
                    return res.status(500).send('Error in file upload');
                }

                const file = files.xmlFile[0];
                const filePath = file.filepath;
                const noExtOriginalFilename = file.originalFilename.replace('.xml', '');
                const encodedFileName = fileHelper.encodeFilename(
                    `${file.newFilename}:${noExtOriginalFilename}`
                );
                const newFilePath = path.join(uploadDir, encodedFileName);

                try {
                    await fileHelper.renameFile(filePath, newFilePath);
                    const fileCreateDate = new Date().toISOString();
                    await xmlProcessor.processXmlFile(newFilePath);
                    return res.status(200).json({
                        id: encodedFileName,
                        originalFileName: noExtOriginalFilename,
                        createDate: fileCreateDate
                    });
                } catch (renameError) {
                    return res.status(500).send('Error in moving or processing file');
                }
            });
        } catch (error) {
            console.error('Server Error:', error);
            return res.status(500).send('Internal server error');
        }
    },

    getAllFiles: async (req, res) => {
        try {
            const fileNames = await fileHelper.readDirectory(uploadDir);

            const filePromises = fileNames.map(async (fileName) => {
                const filepath = path.resolve(uploadDir, fileName);
                const stat = await fileHelper.getFileStats(filepath);
                const [uniqueHash, originalFileName] = fileHelper
                    .decodeFilename(fileName)
                    .split(':');

                if (stat.isFile()) {
                    return {
                        id: fileName,
                        originalFileName,
                        createDate: stat.ctime,
                    };
                }

                return null;
            });

            const files = (await Promise.all(filePromises)).filter((file) => file !== null);
            return res.status(200).json(files);
        } catch (error) {
            console.error('Error reading files:', error);
            return res.status(500).send('Error reading input folder');
        }
    },

    getFile: async (req, res) => {
        try {
            const { fileName } = req.params;
            const filepath = path.resolve(outputDir, `${fileName}.md`);

            const exists = await fileHelper.fileExists(filepath);
            if (!exists) {
                return res.status(404).send('File not found');
            }

            const data = await fileHelper.readFile(filepath);
            return res.status(200).send(data);
        } catch (error) {
            console.error('Error retrieving file:', error);
            return res.status(500).send('Error retrieving file');
        }
    },
};
