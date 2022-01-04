var express = require('express');
var router = express.Router();
const multer = require('multer');
const {spawn} = require('child_process');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
const { Pool, Client } = require('pg')

const client = new Client({
  connectionString: "postgres://rmpponfcllwljz:ab99dcee3e4b2117670f5b6e5a6974942adb5ced53eacb0ced7872a7f72748df@ec2-34-233-64-238.compute-1.amazonaws.com:5432/dc7577bajp72et",
  ssl: {
    rejectUnauthorized: false
  }
})
// client.connect()
// db connection
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'paystack'
// });
// const client = new Client({
//   connectionString: "postgres://jzrcumwvgnyybj:a0d344b136f9d0cb01a3f97877d8b4575e3bca6484d7b6fbbf3132bae8ced144@ec2-3-212-55-200.compute-1.amazonaws.com:5432/dcksh5djih4j0i",
//   // connectionString: "postgres://postres:root@localhost:5432/postgres", 
//   ssl: {
//     rejectUnauthorized: false
//   }
// }) 
client.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as to database ');
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
var verified='';
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
  // verified = req.body
  // const email= req.body.data.customer.email
  // const payment_status= req.body.data.status
  // const tel= req.body.data.customer.phone
  // const paystack_ref= req.body.data.reference 
  // const verification_ref = req.body.data.metadata.custom_fields.value
  // const paidAt = req.body.data.paidAt
  // const firstname = req.body.data.customer.first_name
  // const lastname = req.body.data.customer.last_name
  client.query(`UPDATE paystackusers SET email='${ req.body.data.customer.email}', payment_status='${ req.body.data.status}', telephone='${req.body.data.customer.phone}', paystack_ref='${req.body.data.reference}', paidat='${req.body.data.paidAt}' WHERE reference='${req.body.data.metadata.custom_fields[0].value}' AND first_name='${req.body.data.customer.first_name}'`).then(result => {
    // console.log(result.rowCount)
    console.log("Sucessfully Updated a record")
    res.send("record updated")
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

router.post('/users', function (req, res) {
  console.log(req.body);
  client.query(`INSERT INTO paystackusers (first_name, last_name, email, reference, results, payment_status, telephone, paystack_ref, paidat)
  VALUES ('${req.body.firstname}','${req.body.lastname}', '','${referenceCode}', '${score}','waiting', '','', '');
  `).then(result => {
    console.log(result.rowCount)
    res.send('Sucessfull')
    console.log("Sucessfull")
    // client.end()
  })
  .catch(e => {
    res.send("faileye")
    console.error(e)
    // client.end()
  })
})

// router.post('/test',(req, res)=>{
//   client.query(`INSERT INTO testtable (name, email) VALUES ('${req.body.name}', '${req.body.email}') RETURNING *`)
//   .then(result => {
//     console.log(result.rowCount)
//     res.send(result.rowCount + 'Sucessfull')
//     console.log("Sucessfull")
//     // client.end()
//   })
//   .catch(e => {
//     res.send("faileye")
//     console.error(e)
//     // client.end()
//   })

// })


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

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nuel.emma20@gmail.com',
      pass: 'myfpknfqcidmwfvq'
    }
  });
  
  var mailOptions = {
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
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'nuel.emma20@gmail.com',
//     pass: '0543704435'
//   }
// });

// var mailOptions = {
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
