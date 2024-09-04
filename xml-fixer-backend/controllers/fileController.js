/* eslint-disable prettier/prettier */

const formidable = require('formidable');
const path = require('path');
const xmlProcessor = require('../services/xmlProcessor');
const fileHelper = require('../helpers/fileHelper');

const uploadDir = path.join(__dirname, `..${process.env.UPLOAD_DIR}`);
const outputDir = path.join(__dirname, `..${process.env.OUTPUT_XML_PATH}`);

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
                    // Rename and process the file
                    await fileHelper.renameFile(filePath, newFilePath);

                    // Process XML file
                    await xmlProcessor.processXmlFile(newFilePath);

                    // Get all files and add versions
                    const filesInUploadDir = (
                        await fileHelper.getAllFilesInFolder(uploadDir)
                    ).filter((el) => el.originalFileName === noExtOriginalFilename);

                    const versionedFiles = fileHelper
                        .addVersionToFiles(filesInUploadDir)
                        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

                    const [uploadedFileData, ] = versionedFiles;

                    // Return success response with the necessary details
                    return res.status(200).json(uploadedFileData);
                } catch (renameError) {
                    console.error('Error moving or processing file:', renameError);
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
            const files = await fileHelper.getAllFilesInFolder(uploadDir);

            const versionedFiles = fileHelper
                .addVersionToFiles(files)
                .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
            return res.status(200).json(versionedFiles);
        } catch (error) {
            console.error('Error reading files:', error);
            return res.status(500).send('Error reading input folder');
        }
    },

    getFile: async (req, res) => {
        try {
            const { fileName } = req.params;
            const filePath = path.resolve(outputDir, `${fileName}.md`);

            const exists = await fileHelper.fileExists(filePath);
            if (!exists) {
                return res.status(404).send('File not found');
            }

            const data = await fileHelper.readFile(filePath);
            return res.status(200).json({
                fileName,
                markdown: data,
            });
        } catch (error) {
            console.error('Error retrieving file:', error);
            return res.status(500).send('Error retrieving file');
        }
    },

    downloadFile: async (req, res) => {
        try {
            const { fileName } = req.params;
            const filePath = path.resolve(outputDir, `${fileName}.xml`);

            const exists = await fileHelper.fileExists(filePath);
            if (!exists) {
                return res.status(404).send('File not found');
            }

            // Download the XML file
            return res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error('Error downloading XML file:', err);
                    return res.status(500).send('Error downloading file');
                }
            });
        } catch (error) {
            console.error('Error in downloadFile:', error);
            return res.status(500).send('Internal server error');
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { fileName } = req.params;
            const inputFilepath = path.resolve(uploadDir, fileName);

            // Check if the input file exists
            const inputExists = await fileHelper.fileExists(inputFilepath);
            if (!inputExists) {
                return res.status(404).send('File not found');
            }

            // Delete the input file
            await fileHelper.deleteFile(inputFilepath);

            // List of linked output file extensions
            const linkedOutputFileExtensions = ['md', 'xml'];

            // Delete associated files (e.g., .md, .xml)
            await Promise.all(
                linkedOutputFileExtensions.map(async (ext) => {
                    const outputFilepath = path.resolve(outputDir, `${fileName}.${ext}`);
                    const outputFileExists = await fileHelper.fileExists(outputFilepath);
                    if (outputFileExists) {
                        await fileHelper.deleteFile(outputFilepath);
                    }
                })
            );

            return res.status(200).send('File and associated files deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            return res.status(500).send('Error deleting file');
        }
    },

    deleteAllFiles: async (req, res) => {
        try {
            // Read and delete all files from uploadDir
            const inputFiles = await fileHelper.readDirectory(uploadDir);
            await Promise.all(
                inputFiles.map(async (file) => {
                    const filePath = path.resolve(uploadDir, file);
                    await fileHelper.deleteFile(filePath);
                })
            );

            // Read and delete all files from outputDir
            const outputFiles = await fileHelper.readDirectory(outputDir);
            await Promise.all(
                outputFiles.map(async (file) => {
                    const filePath = path.resolve(outputDir, file);
                    await fileHelper.deleteFile(filePath);
                })
            );

            return res.status(200).send('All files deleted successfully');
        } catch (error) {
            console.error('Error deleting all files:', error);
            return res.status(500).send('Error deleting all files');
        }
    },
};
