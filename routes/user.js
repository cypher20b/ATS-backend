
const multer = require('multer');
const express = require('express');
const router = express.Router();
const {spawn} = require('child_process');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

const client =mysql.createConnection({
  host     : 'localhost',
  user     : 'verony_ats',
  password : 'Amalitech in 2024',
  database : 'verony_ATSDB'
});
client.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as to database ');
});
router.post('/admin/post-job', function (req, res) {
  client.query(`INSERT INTO jobpostings (Title, Description, Company, Location, Category, EmploymentType, Salary, Requirements,Responsibilities, PostedDate, ExpiryDate, ContactEmail,ContactPhone,IsActive)
  VALUES ('${req.body.Title}','${req.body.Description}','${req.body.Company}', '${req.body.Location}','${req.body.Category}','${req.body.EmploymentType}', '${req.body.Salary}','${req.body.Requirements}',
          '${req.body.Responsibilities}', '${req.body.PostedDate}','${req.body.ExpiryDate}', '${req.body.ContactEmail}','${req.body.ContactPhone}', '${req.body.IsActive}');
          `,
          (err, result) => {
            if (err) {
              res.status(500).json({
                code: 500,
                message: 'Error occurred while inserting data into the database',
                error: err.message
              });
            } else {
              console.log(result.insertId)
              const insertedId = result.insertId; // Get the ID of the inserted row
              client.query(
                `SELECT * FROM jobpostings WHERE JobID = ${result.insertId}`,
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
                      data: results[0] // Return the inserted data
                    });
                  }
                }
              );
            }
          }
  )
})

router.post('/admin/register', function (req, res) {
  client.query(
    `INSERT INTO Recruiters (FirstName, LastName, Email, Password, Designation, Specialty, Phone)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.designation, req.body.specialty, req.body.phone],
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: 500,
          message: 'Error occurred while inserting data into the database',
          error: err.message
        });
      } else {
        console.log(result.insertId)
        const insertedId = result.insertId; // Get the ID of the inserted row
        client.query(
          `SELECT * FROM Recruiters WHERE RecruiterID = ${result.insertId}`,
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
                data: results[0] // Return the inserted data
              });
            }
          }
        );
      }
    }
  );
});

router.post('/admin/login', function (req, res) {
  client.query(
    `SELECT * FROM Recruiters `,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        if (result && typeof result === 'object' && result.length > 0) {
          const userEntry = [...result.entries()].find(([index, user]) => user.Email === req.body.email);
          
          if (userEntry) {
              const [index, user] = userEntry;
              if (user.Password === req.body.password) {
                  res.status(200).json({
                      code: "SUCCESS",
                      message: "You have successfully logged in.",
                      data: user
                  });
                  return;
              } else {
                  res.status(401).json({
                      code: "UNAUTHORIZED ACCESS",
                      message: "Incorrect password",
                      data: ""
                  });
                  return;
              }
          } else {
              res.status(404).json({
                  code: "USER NOT FOUND",
                  message: "Unable to authenticate. Please check your credentials.",
                  data: ""
              });
              return;
          }
      }
      }
    }
  );
});

router.post('/admin/single-job-application', function (req, res) {
  client.query(
    `REPLACE INTO applications (JobID, ApplicantID, ApplicationDate, Status)
    VALUES (?, ?, ?, ?)`,
    [req.body.JobID, req.body.ApplicantID, req.body.ApplicationDate, req.body.Status],
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: 500,
          message: 'Error occurred while inserting data into the database',
          error: err.message
        });
      } else {
        console.log(result.insertId)
        const insertedId = result.insertId; // Get the ID of the inserted row
        client.query(
          `SELECT * FROM applications WHERE ApplicationID = ${result.insertId}`,
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
                data: results[0] // Return the inserted data
              });
            }
          }
        );
      }
    }
  );
});

router.post('/admin/job-recruiters', function (req, res) {
  client.query(
    `REPLACE INTO JobRecruiters (JobID, RecruiterID)
    VALUES (?, ?)`,
    [req.body.JobID, req.body.RecruiterID],
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: 500,
          message: 'Error occurred while inserting data into the database',
          error: err.message
        });
      } else {
        console.log(result.insertId)
        const insertedId = result.insertId;
        client.query(
          `SELECT * FROM JobRecruiters WHERE RecruiterID = ${ req.body.RecruiterID} AND JobID = ${req.body.JobID}`,
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


router.post('/admin/send-email', function (req, res) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nuel.emma20@gmail.com',
      pass: 'myfpknfqcidmwfvq'
    }
  });
  
  client.query( `SELECT * FROM applicants WHERE ApplicantID = ${req.body.ApplicantID}`,
          (err, results) => {
            console.log(req.body.Subject, results[0].Email)

            if (err) {
              res.status(500).json({
                code: 500,
                message: 'Error occurred while fetching inserted data',
                error: err.message
              });
            } else {
              
              const mailOptions = {
                from: 'nuel.emma20@gmail.com',
                to: results[0].Email,
                subject: req.body.Subject,
                text: req.body.Text
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log('Email Not sent')
                  res.json(error);
                  return
                } else {
                  console.log('Email sent: ' + info.response);
                  res.status(200).json({
                    code: 200,
                    message: 'Data inserted successfully',
                    data: results[0]
                  });
                }
              });
            }
          })
});

const EducationKeywords = [
  'school', 'students', 'school', 'Assessment', 'experience',
  'success', 'Mentor', 'Curriculum', 'discipline', 'Lesson Plan', 'university'
  
]

const AccountingKeywords = [
'revenue', 'profit', 'client', 'manage', 'improve', 'report', 'tax', 'reporting',
'audit', 'asset', 'capital', 'account', 'broker','finance'
]

const AdministrativeKeywords = [
'administrative', 'leader', 'experience', 'ability', 'manage', 'executive',
'confident', 'resolution', 'board of directors', 'meeting',
'multiple', 'project', 'human resource'
]

const CustomerServiceKeywords = [
'customer', 'experience', 'performance', 'identify', 'client', 'communication',
'interpersonal', 'respect', 'multitask', 'interview', 'task', 'requests', 'call', 'inquiries'
]

const BusinessDataKeywords = [
  'business', 'implement', 'develop', 'data', 'analytics', 'analyze', 'detail', 'customer', 'project', 'software', 'team'
]
const EngineeringKeywords = [
  'engineer', 'engineering', 'team', 'target', 'design', 'timeline', 'project', 'skilled', 'technical',
  'contract', 'management', 'CAD', 'laboratory', 'instrument', 'hardware', 'programming'
]

const ComputerScienceKeywords = []
const HealthcareKeywords = [
'emergency', 'patient', 'medicine', 'care', 'inject', 'steriliz', 'practice', 'treated',
'diagnosed', 'medical', 'lab', 'test', 'vital'
]

const MarketingKeywords = []
const HumanResourceKeywords = []
const ProjectManagementKeywords = []
const WriterKeywords = []
const PharmaceuticalKeywords = []
const NursingKeywords = []
const SalesKeywords = []
const Generalkeywords = [
  'expert', 'email',  'experience',  'lisenced',  'lisence',  'languages',
  'project management',  'reports',  'reporting',  'responibility',
  'efficient',  'efficiently',  'adapt',  'organised',  'organise',
  'accomplish',  'communication',  'target',  'goal',  'goals',
  'safety',  'rewarded',  'completed',  'execute',  'executed',  'address',
  'contact',  'nationality',  'education',  'EDUCATION',  'microsoft',  'word',
  'excel',  'soft skills',  'achieve',  'PROFESSIONAL EXPERIENCE',  'SKILLS AND ACCOMPLISHMENTS',
  'WORK EXPERIENCE', 'JOB TITLE ',  'linkedin.com',  'Management']
let score =0;
const verified='';
let pdfname=''
let resdata
let user = {
  "Name":'',
  "PdfName":'',
  "status":0,
  "reference":''
}
let referenceCode
let processedData = {
  "length":0,
  "education":'',
  "personalInfo":'',
  "experience":'',
  "Roles":'',
  "Contact":'',
  "Email":'',
  "Languages":'',
  "Date of Birth":'',
  "Project":'',
}
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

router.post('/verify',(req, res)=>{
  verified = req.body
  
  client.query(`UPDATE paystackusers SET email='${ req.body.data.customer.email}', payment_status='${ req.body.data.status}', telephone='${req.body.data.customer.phone}', paystack_ref='${req.body.data.reference}', paidat='${req.body.data.paidAt}' WHERE reference='${req.body.data.metadata.custom_fields[0].value}' AND first_name='${req.body.data.customer.first_name}' RETURNING *`).then(result => {
    // console.log(result)
    console.log("Sucessfully Updated a record")
    res.send("record updated")


    //sending email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nuel.emma20@gmail.com',
        pass: 'myfpknfqcidmwfvq'
      }
    });
    
    const mailOptions = {
      from: 'nuel.emma20@gmail.com',
      to: `${req.body.data.customer.email}`,
      subject: 'DPSA CV Results',
      text: `Thank You ${req.body.data.customer.first_name}, for using our services. Your CV scored ${result.rows[0].results}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
    })
    .catch(e => {
    res.send("updating a record in database failed")
    console.error(e)
    // client.end()
    })

  
})

router.get('/paystack',(req, res)=>{
    res.send(verified)
    res.end()
 
  // res.end()
})
router.post('/db',(req, res)=>{
  client.query(`UPDATE paystackusers SET email='${ req.body.data.customer.email}', payment_status='${ req.body.data.status}', telephone='${req.body.data.customer.phone}', paystack_ref='${req.body.data.reference}', paidat='${req.body.data.paidAt}' WHERE reference='${req.body.data.metadata.custom_fields[0].value}'`).then(result => {
    // console.log(result.rowCount)
    console.log(`${req.body.data.customer.email}`);
    console.log(`${req.body.data.status}`);
    console.log(`${req.body.data.customer.phone}`);
    console.log(`${req.body.data.reference}`);
    console.log(`${req.body.data.paidAt}`);
    console.log(`${req.body.data.metadata.custom_fields[0].value}`);
    // console.log(`${req.body.data}`);
    // console.log(`${req.body.data}`);
    console.log("Sucessfully Updated a record")
    res.send("record updated")
    })
    .catch(e => {
    res.send("updating a record in database failed")
    console.error(e)
    // client.end()
    })
})

router.get('/paystackget', (req, res)=>{
  client.query(`SELECT * FROM paystackUsers`).then(result => {
    console.log(result.rowCount)
    res.send(result)
    console.log("Sucessfull")
    // client.end()
  })
  .catch(e => {
    console.log(e);
    res.send(e)
  })
})


  // .catch(e => {
  //   res.json({code:'error', message:e.message, data:''})
  //   console.error(e)
  //   // client.end()
  // })

router.post('/test',(req, res)=>{
  client.query(`INSERT INTO testtable (name, email) VALUES ('${req.body.name}', '${req.body.email}') RETURNING *`)
  .then(result => {
    console.log(result.rowCount)
    res.send(result.rowCount + 'Sucessfull')
    console.log("Sucessfull")
  })
  .catch(e => {
    res.send("faileye")
    console.error(e)
  })

})


router.post("/multipleFiles", upload.array("files"), (req, res, next) => {
  const files = req.files;
  console.log(files[0].filename);
  pdfname = files[0].filename;
  const childpython = spawn("python", ["script1.py", `./uploads/${pdfname}`]);
  childpython.stdout.on("data", (data) => {
       
    switch (req.body.workfield) {
      case 'education':
        EducationKeywords.forEach(keyword => {
          if (data.includes(`${keyword}`)) {
            score = score+10
            console.log(`educate:  ${keyword}`);
            if (score > 99) {
              score = 97.6
            }
          }
        });
        break;

        case 'accounting':
          AccountingKeywords.forEach(keyword => {
            if (data.includes(`${keyword}`)) {
              score = score+6.5
              console.log(`acc: ${keyword}`);
              if (score > 99) {
                score = 97.6
              }
            }
          });
          break;

        case 'administrative':
          AdministrativeKeywords.forEach(keyword => {
            if (data.includes(`${keyword}`)) {
              score = score+10.8
              console.log(`${keyword}`);
              if (score > 99) {
                score = 97.6
              }
            }
          });
          break;

        case 'customerservice':
          CustomerServiceKeywords.forEach(keyword => {
            if (data.includes(`${keyword}`)) {
              score = score+7.2
              console.log(`${keyword}`);
              if (score > 99) {
                score = 97.6
              }
            }
          });
          break;

        case 'business':
          BusinessDataKeywords.forEach(keyword => {
            if (data.includes(`${keyword}`)) {
              score = score+11.2
              console.log(`${keyword}`);
              if (score > 99) {
                score = 97.6
              }
            }
          });
          break;

        case 'engineering':
          EngineeringKeywords.forEach(keyword => {
            if (data.includes(`${keyword}`)) {
              score = score+7.5
              console.log(`${keyword}`);
              if (score > 99) {
                score = 97.6
              }
            }
          });
          break;

          case 'computerscience':
            ComputerScienceKeywords.forEach(keyword => {
              if (data.includes(`${keyword}`)) {
                score = score+1
                console.log(`${keyword}`);
              }
            });
            break;
    
            case 'health':
              HealthcareKeywords.forEach(keyword => {
                if (data.includes(`${keyword}`)) {
                  score = score+10.12
                  console.log(`${keyword}`);
                  if (score > 99) {
                    score = 97.6
                  }
                }
              });
              break;
    
            case 'marketing':
              MarketingKeywords.forEach(keyword => {
                if (data.includes(`${keyword}`)) {
                  score = score+1
                  console.log(`${keyword}`);
                }
              });
              break;
    
            case 'humanresource':
              HumanResourceKeywords.forEach(keyword => {
                if (data.includes(`${keyword}`)) {
                  score = score+1
                  console.log(`${keyword}`);
                }
              });
              break;
    
            case 'projectmanagement':
              ProjectManagementKeywords.forEach(keyword => {
                if (data.includes(`${keyword}`)) {
                  score = score+1
                  console.log(`${keyword}`);
                }
              });
              break;
    
            case 'writer':
              WriterKeywords.forEach(keyword => {
                if (data.includes(`${keyword}`)) {
                  score = score+1
                  console.log(`${keyword}`);
                }
              });
              break;

              case 'pharma':
                PharmaceuticalKeywords.forEach(keyword => {
                  if (data.includes(`${keyword}`)) {
                    score = score+1
                    console.log(`${keyword}`);
                  }
                });
                break;
      
              case 'nursing':
                NursingKeywords.forEach(keyword => {
                  if (data.includes(`${keyword}`)) {
                    score = score+1
                    console.log(`${keyword}`);
                  }
                });
                break;
      
              case 'sales':
                SalesKeywords.forEach(keyword => {
                  if (data.includes(`${keyword}`)) {
                    score = score+1
                    console.log(`${keyword}`);
                  }
                });
                break;
      
              case 'others':
                Generalkeywords.forEach(keyword => {
                  if (data.includes(`${keyword}`)) {
                    score = score+1
                    console.log(`${keyword}`);
                  }
                });
                break;
    
      default:
        break;
    }
    console.log('your CV SCORED ' + score);
    resdata = `${data}`;
    if (pdfname) {
      referenceCode = Math.random().toString(36).substr(2)
      user.Name = req.body.name
       user.PdfName = pdfname
       user.status = 1
       user.reference = referenceCode
       client.query(`INSERT INTO paystackusers (first_name, last_name, email, reference, results, payment_status, telephone, paystack_ref, paidat)
        VALUES ('${req.body.firstname}','${req.body.lastname}', '','${referenceCode}', '${score}','waiting', '','', '');
        `).then(result => {
        console.log(result.rowCount)
        // res.send('Sucessfull')
        console.log("Sucessfull")
        // client.end()
        })
        .catch(e => {
        // res.send("faileye")
        console.error(e)
        // client.end()
        })


       res.json(user)
     } else {
       res.json('upload failed')
     }
    


    score = 0
  });

  childpython.stderr.on("data", (data) => {
    console.log(`${data}`);
    // res.send(data)
  });

  childpython.on("close", (code) => {
    console.log(`python script exited with code ${code}`);
  });
  if (!files) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  // res.send({sttus:  'ok'});
  // res.send(resdata)
});



router.post("/newmultipleFiles", upload.array("files"), (req, res, next) => {
  const files = req.files;
  console.log(files[0].filename);
  console.log(user.Name);
  pdfname = files[0].filename;
 if (pdfname) {
  referenceCode = Math.random().toString(36).substr(2)
  user.Name = req.body.name
   user.PdfName = pdfname
   user.status = 1
   user.reference = referenceCode
   res.json(user)
 } else {
   res.json('upload failed')
 }
});


router.get('/confirmPay', (req, res, next) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nuel.emma20@gmail.com',
      pass: 'myfpknfqcidmwfvq'
    }
  });
  
  const mailOptions = {
    from: 'nuel.emma20@gmail.com',
    to: 'prisc.osei20@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.json('respindein')
});







// 
// Email sending
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'nuel.emma20@gmail.com',
//     pass: '0543704435'
//   }
// });

// const mailOptions = {
//   from: 'nuel.emma20@gmail.com',
//   to: 'prisc.osei20@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
module.exports = router;