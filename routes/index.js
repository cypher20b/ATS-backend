var express = require('express');
var router = express.Router();
const multer = require('multer');
const {spawn} = require('child_process');
const { urlencoded } = require('express');
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
  verified = req.body
})

router.get('/paystack',(req, res)=>{
    res.send(verified)
    res.end()
 
  // res.end()
})

router.post("/multipleFiles", upload.array("files"), (req, res, next) => {
  const files = req.files;
  console.log(files[0].filename);
  pdfname = files[0].filename;
  const childpython = spawn("python", ["script1.py", `./uploads/${pdfname}`]);
  childpython.stdout.on("data", (data) => {
    console.log(data.indexOf("Education")); //find first occurance of a word
    processedData.length = data.length;
    processedData.experience=data.includes("experience");
    processedData.education=data.includes("education");
    processedData.Contact=data.includes("Contact");
    processedData.Roles=data.includes("Roles");
    processedData.Email=data.includes("Email");
    processedData.education=data.includes("education");
    // console.log(`${data}`);
    // console.log(res);
    resdata = `${data}`;
    // res.json(resdata);
    res.json(processedData)
    // res.json('passed sucessfully')
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



router.post("/idleNewmultipleFiles", upload.array("files"), (req, res, next) => {
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
router.get('/newmultipleFiles', (req, res, next) => {
  res.json('respindein')
});

router.get("/confirmPay", (req, res, next) => {
  res.json('respindein')
});
module.exports = router;
