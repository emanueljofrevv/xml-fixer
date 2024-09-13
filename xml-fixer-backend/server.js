/* eslint-disable prettier/prettier */
require('dotenv').config();

const express = require('express');
const path = require('path');
const fileRouter = require('./routes/fileRouter');

const server = express();
const PORT = process.env.DEFAULT_PORT || 3000;

// Serve static files from the FE directory
server.use(express.static(path.join(__dirname, '../xml-fixer-frontend')));

server.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.use('/', fileRouter);

server.listen(PORT, console.log(`Server is running on port: ${PORT}`));
