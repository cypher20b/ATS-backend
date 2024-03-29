var express = require('express');
var router = express.Router();
const multer = require('multer');
const {spawn} = require('child_process');
var nodemailer = require('nodemailer');
var mysql = require('mysql2');
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
const client =mysql.createConnection({
  host     : 'localhost',
  user     : 'verony_ats',
  password : 'Amalitech in 2024',
  database : 'verony_ATSDB'
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express on Applicants route' });
});

router.post("/job-apply", upload.array("files"), (req, res, next) => {
  console.log(req.files)
    client.query(
      `REPLACE INTO applicants (FirstName, LastName, Email,Phone, Resume, CoverLetter)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.files[0]?.originalname, req.files[1]?.originalname],
      (err, result) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: 'Error occurred while inserting data into the database',
            error: err.message
          });
        } else {
          client.query(
            `SELECT * FROM applicants WHERE ApplicantID = ${result.insertId}`,
            (err, results) => {
              if (err) {
                res.status(500).json({
                  code: 500,
                  message: 'Error occurred while fetching inserted data',
                  error: err.message
                });
              } else {
                res.status(200).json({
                  code: 200,
                  message: 'Data inserted successfully',
                  data: results[0] 
                });
              }
            }
          );
        }
      }
    );
});
module.exports = router;
