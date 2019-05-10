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
    callback(null, '../uploads')
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
  var id = req.query.id;
  if (id!=undefined){req.session.idValue = id;

      fs.readFile("../userdata/"+id+'.json', "utf-8", (err, data) => {
    data = JSON.parse(data);
    console.log('****'+JSON.stringify(data));
    var field_data = data['data'];
    field_data = field_data[0];
    var name = JSON.stringify(field_data.name);
    var id   = JSON.stringify(field_data.id);
    var hash = JSON.stringify(field_data.hash);
    console.log('////id'+name+id+hash);
    req.session.name = name;
    req.session.hash = hash;
    // if(hash==='not available'){res.render('dash',{name:name,id:id,hash:'not available!'});}else{res.render('dash',{name:name,id:id,hash:hash});}
});}else{id = req.session.idValue;}
res.render('dash',{name:name,id:id,hash:'not available!'}); 
})

router.get('/regstr',(req,res)=>{
  var key = req.query.key;


fs.readFile('../userdata.json', 'utf8', (err, data)=>{
    if (err){console.log(err);} else {


      fs.readdir("./uploads", function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        console.log(file);
          res.render('dash1',{data:data,file:file}); 
    });
    });

}});



 /*fs.readFile("../userdata", "utf-8", (err, data) => {
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
});*/
})

router.post('/usr',(req,res)=>{
  var key = req.body.key; 
  var no = req.body.no; 
 var name = req.body.name;
 console.log('key=='+key);
 // var obj = {};
 // obj[no] = [];
 var obj = {data:[]}
obj.data.push({id:no,name:name,hash:'not available'});
var jsonData = JSON.stringify(obj);
file_name = '../userdata/'+no+'.json';
console.log(file_name);
 
  console.log('uploading');
   var dir = '../userdata';

 if (!fs.existsSync(dir)){
     fs.mkdirSync(dir);
 }
fs.writeFile(file_name, jsonData,{ flag: 'w' }, function (err) {
                if (err) {console.log('../userdata folder is not available');throw err};
                console.log('Replaced!');
                
                });                  
                res.redirect('/usr?id='+no);  

                
              }); 

router.post('/usr1',(req,res)=>{

     console.log('inside /usr1');
  var dir = '../uploads';

 if (!fs.existsSync(dir)){
     fs.mkdirSync(dir);
 }

  var upload = multer({
    storage: storage
  }).single('myfile')
  upload(req, res, function(err) {
    console.log(' user file is uploaded');
    res.redirect('/usr');
  });

})

router.post('/usr2',(req,res)=>{
  var name = req.body.name;
   var area = req.body.area;
   var loc = req.body.loc;
   console.log('***:'+id);
  //  console.log('before ==='+name+area+loc);
  //  if(name == null | name == undefined){dataa = "";}else{dataa=[name,area,loc];}
  //   console.log('---dataa----'+dataa);
  //  fs.appendFile('../userdata',dataa, function (err) {
  // if (err) throw err;})
  //  res.redirect('/');
  fs.readFile('../userdata.json', 'utf8',(err, data)=>{
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); 
    obj.data.push({property_name:name,property_area:area,property_location:loc}); 
    json = JSON.stringify(obj);
    fs.writeFile('../userdata.json', json, 'utf8', (err)=>{console.log('userdata.json unavilable')});  
    res.redirect('/');
}});




})

router.post('/regstr',(req,res)=>{
  var key = req.body.key; 
  var client = new UserClient(key);
  console.log('log in as a registrar')
  res.send({msg:"registrat"});

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
