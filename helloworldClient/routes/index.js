var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient');
var router = express.Router();
var IPFS = require('ipfs-http-client');
var ipfs = IPFS('127.0.0.1','5001',{protocol:"http"});
var fs   = require('fs');


var app = express();

router.get('/', function(req, res, next) {
  res.render('index1',{title: 'landReg'});
});



/*router.post('/upload',function(req,res,next){
	data = req.files.uploadfile.data;
	console.log(data);


	ipfs.add(data,(err,res1)=>
		{ if(err){console.log(err);};
		if(res1==undefined){console.log('not reading file');console.log('---------------------------------------------------------------');}
		else{
		 console.log('ipfs data:'+JSON.stringify(res1[0]));
		var client = new UserClient();
		client.send_data([res1[0].hash]);
        

        var temp_hash="123test123";
        var client = new UserClient();
        client.send_data([temp_hash]);
        

		res.send('hash:test is added succesfully');
			
	} 
		});		
});*/

router.post('/reg',function(req, res){
  var data1 = req.body.data1;
  var data2 = req.body.data2;
  var data3 = req.body.data3;
  var data4 = req.body.data4;
 var data = {data1:data1,data2:data2,data3:data3}
  console.log("Data sent to REST API", data1+" "+data2+" "+data3);
  var client = new UserClient(data1);
  client.send_data([data1,data2,data3]);
  
  var text = fs.readFileSync('../ipfs-upload/test1','utf8')
  console.log ("filehash////////////////////////"+text)


  res.send({message: "Data " +data+" successfully added"+" .hash is "+text});
})

router.get('/state',async function(req,res){
  var client = new UserClient(null);
  var getData = client._send_to_rest_api(null);
  console.log("Data got from REST API", JSON.stringify(getData));
  getData.then(result => {res.send({ balance : result });});
})

router.post('/state1',async function(req,res){
  var data1 = req.body.data1;  
  var client = new UserClient(data1);
   
  let data = await client.getData();
  console.log("data.data------"+JSON.stringify(data.data));
  data = Buffer.from(data.data[0].data, 'base64').toString();
  
  console.log('state data====='+JSON.stringify(data));

  res.send(JSON.stringify(data));

})


router.post('/regstr',(req,res)=>{
  var key = req.body.key; 
  var client = new UserClient(key);
  console.log('log in as a registrar')
  res.send({msg:"registrat"});

})
router.post('/usr',(req,res)=>{
 var key = req.body.key; 
 var no = req.body.no; 
 var name = req.body.name; 
 var client = new UserClient(key);
 client.send_data([no,name]);
 console.log('log in as a user');
 console.log('name:'+name);
 res.send({name:name,id:no});
})

router.get('/usr',(req,res)=>{
 var client = new UserClient(null);
 let data1 = client.getData().then(data=>{console.log("data.data------"+JSON.stringify(data.data));
  data = Buffer.from(data.data[0].data, 'base64').toString();
  
  console.log('state data====='+JSON.stringify(data));

 console.log('getting user data');res.render('dash',{data:data})});
  
 //
 
})




module.exports = router;

