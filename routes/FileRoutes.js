const Router = require('express').Router;
const fileController = require('../controllers/FileController');

const router = new Router();

router.post('/upload-csv', fileController.uploadcsv);
 
module.exports = router;