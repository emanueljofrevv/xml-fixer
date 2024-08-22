/* eslint-disable prettier/prettier */

const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.uploadFile);
router.get('/files', fileController.getAllFiles);
router.get('/file/:fileName', fileController.getFile);

module.exports = router;
