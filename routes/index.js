var express = require('express');
var router = express.Router();

const videoController = require('../controllers').video;
const apikeyController = require('../controllers').apikey;

/* Video Router */
router.get('/api/video', videoController.list);
router.get('/api/video/search', videoController.search);

/* Apikey Router */
router.post('/api/apikey', apikeyController.add);

module.exports = router;
