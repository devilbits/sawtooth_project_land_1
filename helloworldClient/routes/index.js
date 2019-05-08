// var express = require('express');
// var bodyParser = require('body-parser');
// var { UserClient } = require('./UserClient');
// var router = express.Router();
// var IPFS = require('ipfs-http-client');
// var ipfs = IPFS('127.0.0.1','5001',{protocol:"http"});
// var fs   = require('fs');
// const multer = require('multer');
// const path   = require('path');

//  var storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     callback(null, './uploads')
//   },
//   filename: function(req, file, callback) {
//     console.log(file)
//     callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// });

// router.get('/', function(req, res, next) {
//   res.render('index1',{title: 'landReg'});
// });


// router.post('/regstr',(req,res)=>{
//   var key = req.body.key; 
//   var client = new UserClient(key);
//   console.log('log in as a registrar')
//   res.send({msg:"registrat"});

// })
// /*router.post('/usr',(req,res)=>{
//  var key = req.body.key; 
//  var no = req.body.no; 
//  var name = req.body.name; 
//  var client = new UserClient(key);
//  client.send_data([no,name]);
//  console.log('log in as a user');
//  console.log('name:'+name);
//  res.send({name:name,id:no});
// })
// */

// router.get('/usr',(req,res)=>{
//   var key = req.query.key; 
//   var no = req.query.no; 
//  var name = req.query.name;
//  console.log('entered data='+no+','+name); 
//  var data = str(name+','+no);
//  /*var client = new UserClient(key);
//  client.send_data([no,name]);

//  var client1 = new UserClient(null);
//  let data1 = client1.getData().then(data=>{console.log("data.data------"+JSON.stringify(data.data));
//   data = Buffer.from(data.data[0].data, 'base64').toString();
  
//   console.log('state data====='+JSON.stringify(data));

//  console.log('getting user data');});
  
//  */
// fs.writeFile('../userdata',data,  function (err) {
//                 if (err) throw err;
//                 console.log('user data written');
//                 res.render('dash',{data:data});
//                 });                  
                 

                
//               }); 
                

// router.get('/regstr',(req,res)=>{
//   var key = req.query.key;
//  var client1 = new UserClient(key);
//  /*let data1 = client1.getData().then(data=>{console.log("data.data------"+JSON.stringify(data.data));
//   data = Buffer.from(data.data[0].data, 'base64').toString();
  
//   console.log('state data====='+JSON.stringify(data));

//  console.log('getting user data');});
  
//  res.render('dash',{data:data})
//  */
//  fs.readFile("../userdata", "utf-8", (err, data) => {
//       console.log('data in fileeeeeeeeee'+data);
//       // var client = new UserClient(key);
//       // client.send_data([data])
                   
//      fs.readdir("./uploads", function (err, files) {
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     } 
//     files.forEach(function (file) {
//         console.log(file);
//           res.render('dash1',{data:data,file:file}); 
//     });
// });



// });
  

// })


// /* router.post('/usr', function(req, res) {
//   console.log('uploading');
 
//   var upload = multer({
//     storage: storage
//   }).single('myfile')
//   upload(req, res, function(err) {
//     res.send('File is uploaded')
//   })
// })*/

// router.post('/hash',(req,res)=>{

// fs.readFile("../ipfs-upload/test1", "utf-8", (err, data) => {
//       console.log('data in fileeeeeeeeee'+data);})
     


// })

// router.post('/hash',(req,res)=>{
//    fs.readFile("../ipfs-upload/test1", "utf-8", (err, data)=>{
//     console.log('hash data='+data);
//      //print this hash
//    });

// });
// router.post('/block',(req,res)=>{
//   fs.readFile("../ipfs-upload/test1", "utf-8", (err, data)=>{
//     console.log('hash data='+data);
//         fs.readFile("../userdata", "utf-8", (err, data1)=>{
//          console.log('block data='+data+data1);})
//   })

// });
// router.post('/rjct',(req,res)=>{
 

//   fs.writeFile('../userdata',"", function (err) {
//                 if (err) throw err;
//                 console.log('user data rmoved');
//                 }); 



// });


// module.exports = router;











//----------------------------------------------------------------------








var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient');
var router = express.Router();
var IPFS = require('ipfs-http-client');
var ipfs = IPFS('127.0.0.1','5001',{protocol:"http"});
var fs   = require('fs');
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

  res.render('index1',{title: 'landReg'});
});

router.get('/usr',(req,res)=>{
  fs.readFile("../userdata", "utf-8", (err, data) => {
  res.render('dash',{data:data});})
});

router.post('/regstr',(req,res)=>{
  var key = req.body.key; 
  var client = new UserClient(key);
  console.log('log in as a registrar')
  res.send({msg:"registrat"});

})
/*router.post('/usr',(req,res)=>{
 var key = req.body.key; 
 var no = req.body.no; 
 var name = req.body.name; 
 var client = new UserClient(key);
 client.send_data([no,name]);
 console.log('log in as a user');
 console.log('name:'+name);
 res.send({name:name,id:no});
})
*/

router.post('/usr',(req,res)=>{
  var key = req.body.key; 
  var no = req.body.no; 
 var name = req.body.name;
 console.log('key=='+key);
 data = [no,name];
 console.log('after');
 console.log('dataaaaa:'+data)
 /*var client = new UserClient(key);
 client.send_data([no,name]);

 var client1 = new UserClient(null);
 let data1 = client1.getData().then(data=>{console.log("data.data------"+JSON.stringify(data.data));
  data = Buffer.from(data.data[0].data, 'base64').toString();
  
  console.log('state data====='+JSON.stringify(data));

 console.log('getting user data');});
  
 */
fs.writeFile('../userdata', data, function (err) {
                if (err) throw err;
                console.log('Replaced!');
                });                  
                  

                res.send({msg:'data sent succesful'});
              }) 
                

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
      // var client = new UserClient(key);
      // client.send_data([data])
                   
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

/*router.post('/usr', function(req, res) {
  console.log('uploading');
 
  var upload = multer({
    storage: storage
  }).single('myfile')
  upload(req, res, function(err) {
    res.end('File is uploaded')
  })
})

*/


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

module.exports = router;
