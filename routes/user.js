
const multer = require('multer');
const express = require('express');
const router = express.Router();
const {spawn} = require('child_process');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

const client =mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PWD,
  database : process.env.DB
});
client.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as to database ');
});
router.post('/admin/post-job', function (req, res) {
  client.query(`INSERT INTO JobPostings (Title, Description, Location, EmploymentType, SalaryRange, JobCategories, ExperienceLevel, Education, Requirements,Responsibilities, PostedDate, ExpiryDate, ContactEmail,ContactPhone,IsActive)
  VALUES ('${req.body.Title}','${req.body.Description}','${req.body.Location}','${req.body.EmploymentType}','${req.body.SalaryRange}', '${req.body.JobCategories}', '${req.body.ExperienceLevel}', '${req.body.Education}',
  '${req.body.Requirements}','${req.body.Responsibilities}', '${req.body.PostedDate}','${req.body.ExpiryDate}', '${req.body.ContactEmail}','${req.body.ContactPhone}', '${req.body.IsActive}');
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
                `SELECT * FROM JobPostings WHERE JobID = ${result.insertId}`,
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

router.patch('/admin/post-job/:id', function (req, res) {
  client.query(`UPDATE JobPostings
      SET Title = '${req.body.Title}',
      Description = '${req.body.Description}',
      Location = '${req.body.Location}',
      JobCategories = '${req.body.JobCategories}',
      EmploymentType = '${req.body.EmploymentType}',
      SalaryRange = '${req.body.SalaryRange}',
      ExperienceLevel = '${req.body.ExperienceLevel}',
      Education = '${req.body.Education}',
      Requirements = '${req.body.Requirements}',
      Responsibilities = '${req.body.Responsibilities}',
      PostedDate = '${req.body.PostedDate}',
      ExpiryDate = '${req.body.ExpiryDate}',
      ContactEmail = '${req.body.ContactEmail}',
      ContactPhone = '${req.body.ContactPhone}',
      IsActive = '${req.body.IsActive}'
      WHERE JobID = ${req.params.id}`,
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
                `SELECT * FROM JobPostings WHERE JobID = ${req.params.id}`,
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

router.patch('/admin/recruiter/:id', function (req, res) {
  client.query(
    `UPDATE Recruiters
    SET FirstName = ?,
        LastName = ?,
        Email = ?,
        Password = ?,
        Designation = ?,
        Specialty = ?,
        Phone = ?
    WHERE RecruiterID = ${req.params.id}`,
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
          `SELECT * FROM Recruiters WHERE RecruiterID = ${req.params.id}`,
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
    `REPLACE INTO Applications (JobID, ApplicantID, ApplicationDate, Status)
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
          `SELECT * FROM Applications WHERE ApplicationID = ${result.insertId}`,
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
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });
  
  client.query( `SELECT * FROM Applicants WHERE ApplicantID = ${req.body.ApplicantID}`,
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
                from: '"The ATS Team" <nuel.emma20@gmail.com>',
                to: results[0].Email,
                subject: req.body.Subject,
                html:`${req.body.Text}`
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
                    data: [results[0],info]
                  });
                }
              });
            }
          })
});


// GET REQUESTS
router.get('/admin/job/:id', function (req, res) {
  client.query(
    `SELECT * FROM JobPostings WHERE JobID = ${req.params.id} `,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: '',
          data: result
        })
      }
    }
  );
});

router.get('/admin/job', function (req, res) {
  client.query(
    `SELECT * FROM JobPostings`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: '',
          data: result
        })
      }
    }
  );
});

router.get('/admin/get-recruiter/:id', function (req, res) {
  client.query(
    `SELECT * FROM Recruiters WHERE RecruiterID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: '',
          data: result
        })
      }
    }
  );
});

router.get('/admin/get-recruiters', function (req, res) {
  client.query(
    `SELECT * FROM Recruiters`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: '',
          data: result
        })
      }
    }
  );
});

router.get('/admin/get-application/:id', function (req, res) {
  client.query(
    `SELECT * FROM Applications WHERE ApplicationID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: '',
          data: result
        })
      }
    }
  );
});

router.get('/admin/get-applications', function (req, res) {
  client.query(
    `SELECT * FROM Applications`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: '',
          data: result
        })
      }
    }
  );
});


// DELETE REQUESTS
router.delete('/admin/job/:id', function (req, res) {
  client.query(
    `DELETE * FROM JobPostings WHERE JobID = ${req.params.id} `,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while deleting data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: `Job with ID=${req.params.id} has been successfully deleted`,
          data: 'Deleted'
          })
      }
    }
  );
});

router.delete('/admin/delete-recruiter/:id', function (req, res) {
  client.query(
    `DELETE * FROM Recruiters WHERE RecruiterID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: `User with ID=${req.params.id} has been successfully deleted`,
          data: 'Deleted'
          })
      }
    }
  );
});

router.delete('/admin/delete-application/:id', function (req, res) {
  client.query(
    `DELETE * FROM Applications WHERE ApplicationID = ${req.params.id}`,
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: "FAILED",
          message: 'Error occurred while fetching data from the database',
          error: err
        });
      } else {
        res.status(200).json({
          code: "SUCCESS",
          message: `Job application ${req.params.id} has been successfully deleted`,
          data: 'Deleted'
          })
      }
    }
  );
});

// const storage = multer.diskStorage({
//   destination: (req, file, callBack) => {
//       callBack(null, 'uploads')
//   },
//   filename: (req, file, callBack) => {
//       callBack(null, `CV_${file.originalname}`)
//   }
// })

// const upload = multer({ storage: storage })
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.post('/verify',(req, res)=>{
//   verified = req.body
  
//   client.query(`UPDATE paystackusers SET email='${ req.body.data.customer.email}', payment_status='${ req.body.data.status}', telephone='${req.body.data.customer.phone}', paystack_ref='${req.body.data.reference}', paidat='${req.body.data.paidAt}' WHERE reference='${req.body.data.metadata.custom_fields[0].value}' AND first_name='${req.body.data.customer.first_name}' RETURNING *`).then(result => {
//     // console.log(result)
//     console.log("Sucessfully Updated a record")
//     res.send("record updated")


//     //sending email
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'nuel.emma20@gmail.com',
//         pass: 'myfpknfqcidmwfvq'
//       }
//     });
    
//     const mailOptions = {
//       from: 'nuel.emma20@gmail.com',
//       to: `${req.body.data.customer.email}`,
//       subject: 'DPSA CV Results',
//       text: `Thank You ${req.body.data.customer.first_name}, for using our services. Your CV scored ${result.rows[0].results}`
//     };
    
//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });
    
//     })
//     .catch(e => {
//     res.send("updating a record in database failed")
//     console.error(e)
//     // client.end()
//     })

  
// })

// router.get('/paystack',(req, res)=>{
//     res.send(verified)
//     res.end()
 
//   // res.end()
// })
// router.post('/db',(req, res)=>{
//   client.query(`UPDATE paystackusers SET email='${ req.body.data.customer.email}', payment_status='${ req.body.data.status}', telephone='${req.body.data.customer.phone}', paystack_ref='${req.body.data.reference}', paidat='${req.body.data.paidAt}' WHERE reference='${req.body.data.metadata.custom_fields[0].value}'`).then(result => {
//     // console.log(result.rowCount)
//     console.log(`${req.body.data.customer.email}`);
//     console.log(`${req.body.data.status}`);
//     console.log(`${req.body.data.customer.phone}`);
//     console.log(`${req.body.data.reference}`);
//     console.log(`${req.body.data.paidAt}`);
//     console.log(`${req.body.data.metadata.custom_fields[0].value}`);
//     // console.log(`${req.body.data}`);
//     // console.log(`${req.body.data}`);
//     console.log("Sucessfully Updated a record")
//     res.send("record updated")
//     })
//     .catch(e => {
//     res.send("updating a record in database failed")
//     console.error(e)
//     // client.end()
//     })
// })

// router.get('/paystackget', (req, res)=>{
//   client.query(`SELECT * FROM paystackUsers`).then(result => {
//     console.log(result.rowCount)
//     res.send(result)
//     console.log("Sucessfull")
//     // client.end()
//   })
//   .catch(e => {
//     console.log(e);
//     res.send(e)
//   })
// })


//   // .catch(e => {
//   //   res.json({code:'error', message:e.message, data:''})
//   //   console.error(e)
//   //   // client.end()
//   // })

// router.post('/test',(req, res)=>{
//   client.query(`INSERT INTO testtable (name, email) VALUES ('${req.body.name}', '${req.body.email}') RETURNING *`)
//   .then(result => {
//     console.log(result.rowCount)
//     res.send(result.rowCount + 'Sucessfull')
//     console.log("Sucessfull")
//   })
//   .catch(e => {
//     res.send("faileye")
//     console.error(e)
//   })

// })


// router.post("/multipleFiles", upload.array("files"), (req, res, next) => {
//   const files = req.files;
//   console.log(files[0].filename);
//   pdfname = files[0].filename;
//   const childpython = spawn("python", ["script1.py", `./uploads/${pdfname}`]);
//   childpython.stdout.on("data", (data) => {
       
//     switch (req.body.workfield) {
//       case 'education':
//         EducationKeywords.forEach(keyword => {
//           if (data.includes(`${keyword}`)) {
//             score = score+10
//             console.log(`educate:  ${keyword}`);
//             if (score > 99) {
//               score = 97.6
//             }
//           }
//         });
//         break;

//         case 'accounting':
//           AccountingKeywords.forEach(keyword => {
//             if (data.includes(`${keyword}`)) {
//               score = score+6.5
//               console.log(`acc: ${keyword}`);
//               if (score > 99) {
//                 score = 97.6
//               }
//             }
//           });
//           break;

//         case 'administrative':
//           AdministrativeKeywords.forEach(keyword => {
//             if (data.includes(`${keyword}`)) {
//               score = score+10.8
//               console.log(`${keyword}`);
//               if (score > 99) {
//                 score = 97.6
//               }
//             }
//           });
//           break;

//         case 'customerservice':
//           CustomerServiceKeywords.forEach(keyword => {
//             if (data.includes(`${keyword}`)) {
//               score = score+7.2
//               console.log(`${keyword}`);
//               if (score > 99) {
//                 score = 97.6
//               }
//             }
//           });
//           break;

//         case 'business':
//           BusinessDataKeywords.forEach(keyword => {
//             if (data.includes(`${keyword}`)) {
//               score = score+11.2
//               console.log(`${keyword}`);
//               if (score > 99) {
//                 score = 97.6
//               }
//             }
//           });
//           break;

//         case 'engineering':
//           EngineeringKeywords.forEach(keyword => {
//             if (data.includes(`${keyword}`)) {
//               score = score+7.5
//               console.log(`${keyword}`);
//               if (score > 99) {
//                 score = 97.6
//               }
//             }
//           });
//           break;

//           case 'computerscience':
//             ComputerScienceKeywords.forEach(keyword => {
//               if (data.includes(`${keyword}`)) {
//                 score = score+1
//                 console.log(`${keyword}`);
//               }
//             });
//             break;
    
//             case 'health':
//               HealthcareKeywords.forEach(keyword => {
//                 if (data.includes(`${keyword}`)) {
//                   score = score+10.12
//                   console.log(`${keyword}`);
//                   if (score > 99) {
//                     score = 97.6
//                   }
//                 }
//               });
//               break;
    
//             case 'marketing':
//               MarketingKeywords.forEach(keyword => {
//                 if (data.includes(`${keyword}`)) {
//                   score = score+1
//                   console.log(`${keyword}`);
//                 }
//               });
//               break;
    
//             case 'humanresource':
//               HumanResourceKeywords.forEach(keyword => {
//                 if (data.includes(`${keyword}`)) {
//                   score = score+1
//                   console.log(`${keyword}`);
//                 }
//               });
//               break;
    
//             case 'projectmanagement':
//               ProjectManagementKeywords.forEach(keyword => {
//                 if (data.includes(`${keyword}`)) {
//                   score = score+1
//                   console.log(`${keyword}`);
//                 }
//               });
//               break;
    
//             case 'writer':
//               WriterKeywords.forEach(keyword => {
//                 if (data.includes(`${keyword}`)) {
//                   score = score+1
//                   console.log(`${keyword}`);
//                 }
//               });
//               break;

//               case 'pharma':
//                 PharmaceuticalKeywords.forEach(keyword => {
//                   if (data.includes(`${keyword}`)) {
//                     score = score+1
//                     console.log(`${keyword}`);
//                   }
//                 });
//                 break;
      
//               case 'nursing':
//                 NursingKeywords.forEach(keyword => {
//                   if (data.includes(`${keyword}`)) {
//                     score = score+1
//                     console.log(`${keyword}`);
//                   }
//                 });
//                 break;
      
//               case 'sales':
//                 SalesKeywords.forEach(keyword => {
//                   if (data.includes(`${keyword}`)) {
//                     score = score+1
//                     console.log(`${keyword}`);
//                   }
//                 });
//                 break;
      
//               case 'others':
//                 Generalkeywords.forEach(keyword => {
//                   if (data.includes(`${keyword}`)) {
//                     score = score+1
//                     console.log(`${keyword}`);
//                   }
//                 });
//                 break;
    
//       default:
//         break;
//     }
//     console.log('your CV SCORED ' + score);
//     resdata = `${data}`;
//     if (pdfname) {
//       referenceCode = Math.random().toString(36).substr(2)
//       user.Name = req.body.name
//        user.PdfName = pdfname
//        user.status = 1
//        user.reference = referenceCode
//        client.query(`INSERT INTO paystackusers (first_name, last_name, email, reference, results, payment_status, telephone, paystack_ref, paidat)
//         VALUES ('${req.body.firstname}','${req.body.lastname}', '','${referenceCode}', '${score}','waiting', '','', '');
//         `).then(result => {
//         console.log(result.rowCount)
//         // res.send('Sucessfull')
//         console.log("Sucessfull")
//         // client.end()
//         })
//         .catch(e => {
//         // res.send("faileye")
//         console.error(e)
//         // client.end()
//         })


//        res.json(user)
//      } else {
//        res.json('upload failed')
//      }
    


//     score = 0
//   });

//   childpython.stderr.on("data", (data) => {
//     console.log(`${data}`);
//     // res.send(data)
//   });

//   childpython.on("close", (code) => {
//     console.log(`python script exited with code ${code}`);
//   });
//   if (!files) {
//     const error = new Error("No File");
//     error.httpStatusCode = 400;
//     return next(error);
//   }
//   // res.send({sttus:  'ok'});
//   // res.send(resdata)
// });



// router.post("/newmultipleFiles", upload.array("files"), (req, res, next) => {
//   const files = req.files;
//   console.log(files[0].filename);
//   console.log(user.Name);
//   pdfname = files[0].filename;
//  if (pdfname) {
//   referenceCode = Math.random().toString(36).substr(2)
//   user.Name = req.body.name
//    user.PdfName = pdfname
//    user.status = 1
//    user.reference = referenceCode
//    res.json(user)
//  } else {
//    res.json('upload failed')
//  }
// });


// router.get('/confirmPay', (req, res, next) => {
//   console.log(req.body);

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'nuel.emma20@gmail.com',
//       pass: 'myfpknfqcidmwfvq'
//     }
//   });
  
//   const mailOptions = {
//     from: 'nuel.emma20@gmail.com',
//     to: 'prisc.osei20@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
//   res.json('respindein')
// });







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
