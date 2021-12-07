var express = require('express');
var router = express.Router();
var verified;
let pdfname
let resdata
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/verify',(req, res)=>{
  verified = req.body
})

router.get('/paystack', (req, res)=>{
  res.send(verified)
})

router.post('/multipleFiles', upload.array('files'), (req, res, next) => {
  const files = req.files;
  console.log(files[0].filename);
  pdfname = files[0].filename
  const  childpython = spawn('python', ['script1.py', `./uploads/${pdfname}`]);
  childpython.stdout.on('data', (data)=>{
    console.log(data.indexOf("Education"));//find first occurance of a word 
    console.log(`${data}`);
    resdata=`${data}`
    res.json(resdata)
    // res.send('passed sucessfully')
})

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
