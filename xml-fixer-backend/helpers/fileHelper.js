/* eslint-disable prettier/prettier */

const fs = require('fs');

const fsPromises = fs.promises;

async function writeFile(filePath, content) {
    try {
        await fsPromises.writeFile(filePath, content, 'utf8');
        console.log(`File written successfully to ${filePath}`);
    } catch (error) {
        throw new Error(`Error writing file: ${error.message}`);
    }
}

async function renameFile(oldPath, newPath) {
    try {
        await fsPromises.rename(oldPath, newPath);
    } catch (error) {
        console.error(error)
        throw new Error('Error renaming file');
    }
}

async function readDirectory(directory) {
    try {
        return await fsPromises.readdir(directory);
    } catch (error) {
        console.error(error);
        throw new Error('Error reading directory');
    }
}

async function getFileStats(filepath) {
    try {
        return await fsPromises.stat(filepath);
    } catch (error) {
        console.error(error)
        throw new Error('Error getting file stats');
    }
}

async function readFile(filepath, encoding = 'utf8') {
    try {
        return await fsPromises.readFile(filepath, encoding);
    } catch (error) {
        console.error(error)
        throw new Error('Error reading file');
    }
}

async function fileExists(filepath) {
    try {
        await fsPromises.access(filepath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function deleteFile(filepath) {
    try {
        await fsPromises.unlink(filepath);
    } catch (error) {
        console.error(error)
        throw new Error(`Error deleting file: ${error.message}`);
    }
}

function encodeFilename(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // Remove any trailing '=' padding
}

function decodeFilename(encoded) {
    // This calculates the remainder when the length of the string is divided by 4.
    // In Base64, the string length must be a multiple of 4. If it's not, it needs padding.
    const properBase64encoded = encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=');
    return Buffer.from(properBase64encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

module.exports = {
    writeFile,
    renameFile,
    readDirectory,
    getFileStats,
    readFile,
    fileExists,
    deleteFile,
    encodeFilename,
    decodeFilename,
};
