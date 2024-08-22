/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;

// Function to rename (move) a file
async function renameFile(oldPath, newPath) {
    try {
        await fsPromises.rename(oldPath, newPath);
    } catch (error) {
        throw new Error('Error renaming file');
    }
}

// Function to read the directory and get file names
async function readDirectory(directory) {
    try {
        return await fsPromises.readdir(directory);
    } catch (error) {
        throw new Error('Error reading directory');
    }
}

// Function to get file stats
async function getFileStats(filepath) {
    try {
        return await fsPromises.stat(filepath);
    } catch (error) {
        throw new Error('Error getting file stats');
    }
}

// Function to read a file's contents
async function readFile(filepath, encoding = 'utf8') {
    try {
        return await fsPromises.readFile(filepath, encoding);
    } catch (error) {
        throw new Error('Error reading file');
    }
}

// Function to check if a file exists
async function fileExists(filepath) {
    try {
        await fsPromises.access(filepath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

// Function to encode the filename
function encodeFilename(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // Remove any trailing '=' padding
}

// Function to decode the filename
function decodeFilename(encoded) {
    encoded = encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=');
    return Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

// Exporting all the helper functions
module.exports = {
    renameFile,
    readDirectory,
    getFileStats,
    readFile,
    fileExists,
    encodeFilename,
    decodeFilename,
};
