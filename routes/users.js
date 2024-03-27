var express = require('express');
var router = express.Router();
const multer = require('multer');
const {spawn} = require('child_process');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
      callBack(null, `CV_${file.originalname}`)
  }
})

const upload = multer({ storage: storage })
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/jobApply', (req, res, next)=>{
  const files = req.files;
  console.log('files');
  console.log(req.body)
  res.send(req.body)
})
module.exports = router;
