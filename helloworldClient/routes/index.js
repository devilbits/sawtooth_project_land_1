var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient');
var router = express.Router();
var IPFS = require('ipfs-http-client');
var ipfs = IPFS('127.0.0.1','5001',{protocol:"http"});
var fs   = require('fs');
var removeDir = require("rimraf");
const multer = require('multer');
const path   = require('path');


 var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads')
  },
  filename: function(req, file, callback) {
    console.log(file)
    callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

router.get('/', function(req, res, next) {

  res.render('dlogin',{title: 'landReg'});
});

router.get('/usr',(req,res)=>{
   

  fs.readFile("../userdata", "utf-8", (err, data) => {
    data = data.toString().trim().split(',');
   


   if(data[2]==undefined){res.render('dash',{name:data[0],id:data[1],hash:'not available'});}else{res.render('dash',{name:data[0],id:data[1],hash:data[2]});}
 
});})


router.post('/usr2',(req,res)=>{
  var name = req.body.name;
   var area = req.body.area;
   var loc = req.body.loc;
   console.log('before ==='+name+area+loc);
   if(name == null | name == undefined){dataa = "";}else{dataa=[name,area,loc];}
    console.log('---dataa----'+dataa);
   fs.appendFile('../userdata',dataa, function (err) {
  if (err) throw err;})
   res.redirect('/usr');

})

router.post('/regstr',(req,res)=>{
  var key = req.body.key; 
  var client = new UserClient(key);
  console.log('log in as a registrar')
  res.send({msg:"registrat"});

})

router.post('/usr1',(req,res)=>{
     
  var dir = './uploads';

// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }

  var upload = multer({
    storage: storage
  }).single('myfile')
  upload(req, res, function(err) {
    console.log('File is uploaded');
    res.redirect('/usr');
  });

})


router.post('/usr',(req,res)=>{
  var key = req.body.key; 
  var no = req.body.no; 
 var name = req.body.name;
 console.log('key=='+key);
 data = [no,name];
 console.log('after');
 console.log('dataaaaa:'+data)
 
  console.log('uploading');

fs.writeFile('../userdata', data, function (err) {
                if (err) throw err;
                console.log('Replaced!');
                });                  
                  

                res.redirect('back');
              }); 
                

router.get('/regstr',(req,res)=>{
  var key = req.query.key;
 var client1 = new UserClient(key);
 /*let data1 = client1.getData().then(data=>{console.log("data.data------"+JSON.stringify(data.data));
  data = Buffer.from(data.data[0].data, 'base64').toString();
  
  console.log('state data====='+JSON.stringify(data));

 console.log('getting user data');});
  
 res.render('dash',{data:data})
 */
 fs.readFile("../userdata", "utf-8", (err, data) => {
      console.log('data in fileeeeeeeeee'+data);
     fs.readdir("./uploads", function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        console.log(file);
          res.render('dash1',{data:data,file:file}); 
    });
});



});
  

})



router.post('/hash',(req,res)=>{
  console.log('inside /hash')
  fs.readFile('../ipfs-upload/test1', function (err, data) {
  if (err) throw err;
  
  fs.appendFile('../userdata',','+data, function (err) {
  if (err) throw err;
  console.log('hash Saved!');
  res.redirect('back')
});

});
});

router.post('/block',(req,res)=>{
var key = req.body.key;


  var client = new UserClient(key);
  fs.readFile('../userdata', function (err, data) {
  if (err) throw err;
  client.send_data(data);
  console.log('data added to block')
  

 removeDir("./uploads", function () { console.log("data removed"); });

});});
router.post('/rjct',(req,res)=>{
  fs.writeFile('../userdata', "", function (err) {
                if (err) throw err;
                console.log('user data removed');
                });
  fs.writeFile('../ipfs-upload/test1',"", function (err) {
                if (err) throw err;
                console.log('ipfs hash replaced');
                });                          
});

module.exports = router;
