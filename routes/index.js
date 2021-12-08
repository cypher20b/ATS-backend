var express = require('express');
var router = express.Router();
const multer = require('multer');
const {spawn} = require('child_process');
var verified='before';
let pdfname
let resdata

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
  console.log(req);
})

router.get('/paystack', (req, res)=>{
  res.json(verified)
})

router.post('/multipleFiles', upload.array('files'), (req, res, next) => {
  const files = req.files;
  console.log(files[0].filename);
  pdfname = files[0].filename
  const  childpython = spawn('python', ['script1.py', `./uploads/${pdfname}`]);
  childpython.stdout.on('data', (data)=>{ 
   console.log(data.indexOf("Education")); //find first occurance of a word
    processedData.length = data.length;
    processedData.education=data.match(/ain/gi);
    processedData.experience=data.includes("world");
    // console.log(`${data}`);
    // console.log(res);
    resdata = `${data}`;
    res.json(processedData);
    // res.json('passed sucessfully')
  });

childpython.stderr.on('data', (data)=>{
    console.log(`${data}`);
    // res.send(data)
})

childpython.on('close', (code)=>{
    console.log(`python script exited with code ${code}`);
})
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    // res.send({sttus:  'ok'});
    // res.send(resdata)
})

module.exports = router;
