/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.upload);
router.get('/files', () => {}); //TODO: finish this
router.get('/file/:fileName', () => {}); //TODO: finish this

module.exports = router;
