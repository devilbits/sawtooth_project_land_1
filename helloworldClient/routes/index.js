var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient')
var router = express.Router();
var multer  = require('multer')


var upload = multer({ dest: '/upload/image' })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{title: 'KBA'});
});


router.get('/login',function(req, res, next) {
//router.get('/login',function(req, res, next) {  
  var dat1 = req.body.test;
  console.log('********************************'+dat1);

    
    res.render('index',{title: 'KBA' });

   //res.render('index',{title: 'KBA'});
    console.log(filename+"***"+uploadStatus+"////////////////////////////////");
});

router.post('/upload/image',upload.single('uploadfile'),function(req,res,next){
  console.log('image file running ......................................');

  if (req.file) {
        console.log('Uploading file...');
        var filename = req.file.filename;
        var uploadStatus = 'File Uploaded Successfully';

    } else {
        console.log('No File Uploaded');
        var filename = 'FILE NOT UPLOADED';
        var uploadStatus = 'File Upload Failed';
    } 
    
 console.log(filename+"***"+uploadStatus+"////////////////////////////////");

});

router.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/test.txt"));
});


router.post('/reg',function(req, res){
  var data1 = req.body.data1;
  var data2 = req.body.data2;
  var data3 = req.body.data3;
  var data4 = req.body.data4;
 var data = {data1:data1,data2:data2,data3:data3}
  console.log("Data sent to REST API", data1+" "+data2+" "+data3);
  var client = new UserClient();
  client.send_data([data]);
  res.send({message: "Data " +data+" successfully added"});
})

router.get('/state',async function(req,res){
  var client = new UserClient();
  var getData = client._send_to_rest_api(null);
  console.log("Data got from REST API", getData);
  getData.then(result => {res.send({ balance : result });});
})




module.exports = router;
