var express = require('express');
var router = express.Router();
var verified = 'before';
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

module.exports = router;
