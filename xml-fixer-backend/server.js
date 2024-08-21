/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const express = require('express');
const fileRouter = require('./routes/fileRouter');

const server = express();
const PORT = process.env.DEFAULT_PORT;

server.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.use('/', fileRouter);

server.listen(PORT, console.log(`Server is running on port: ${PORT}`));
