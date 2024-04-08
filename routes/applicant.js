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
  host     : process.env.HOST,
  user     : process.env.USER,
  // password : process.env.PWD,
  database : process.env.DB
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express on Applicants route' });
});
router.post("/job-apply", upload.array("files"), (req, res, next) => {
  const files = req.files;
  const pdfname = files[0].filename;
  console.log(pdfname);
  client.query(`SELECT * FROM JobPostings WHERE JobID = ${req.body.jobID}`,(err, result,fields)=>{
    if (err) {
      res.status(500).json({
        code:500,
        message:err.message,
        data:`failed to access database 1`
      })
      return
    }
    
    const jobDescription = result[0].Description +'. '+result[0].Requirements
    const pythonProcess = spawn("python", ["script1.py", `./uploads/${pdfname}`, jobDescription]);
    pythonProcess.stdout.on("data", (data) => {
      client.query(
        `INSERT INTO Applicants (FirstName, LastName, Email, Phone, Resume, CoverLetter)
        SELECT ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (SELECT 1 FROM Applicants WHERE Email = ?)`,
        [req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.files[0]?.originalname, req.files[1]?.originalname, req.body.email],
        (err, applicantResult) => {
            if (err) {
                res.status(500).json({
                    code: 500,
                    message: err,
                    data: "Failed to access database 2"
                });
                return;
            }

            client.query(
                `INSERT INTO Applications (JobID, ApplicantID, ApplicationDate, Email, Status, CVScore)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [Number(`${req.body.jobID}`), applicantResult.insertId, '12/05/2024', req.body.email, req.body.Status, `${parseFloat(data.toString())}`],
                (err, result) => {
                    if (err) {
                        res.status(500).json({
                            code: 500,
                            message: err,
                            data: "Failed to access database 3"
                        });
                        return;
                    }
                    res.status(200).json({
                        code: 200,
                        message: 'Application Successful',
                        data: `CV SCORED ${parseFloat(data.toString())}, BASE ON THE JOB DESCRIPTION AND REQUIREMENTS`
                    });
                }
            );
        }
    );
        
  });

    pythonProcess.stderr.on("data", (error) => {
        console.error("Python Script Error:", error.toString());
        res.status(200).json({
          code: 200,
          message: 'Error parsing Document',
          data: error.toString()
        })
    });

    pythonProcess.on("close", (code) => {
      // res.status(200).json({
      //   code:'SUCCESS',
      //   message:result[0].Description +'. '+result[0].Requirements,
      //   data:result
      // })
    });
  })
  
  
});
module.exports = router;
