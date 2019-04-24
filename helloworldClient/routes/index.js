var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient');
var router = express.Router();
var IPFS = require('ipfs-http-client');
var ipfs = IPFS('127.0.0.1','5001',{protocol:"http"});


router.get('/', function(req, res, next) {
  res.render('index',{title: 'KBA'});
});

router.post('/upload',function(req,res,next){
	data = req.files.uploadfile.data;
	console.log(data);


	ipfs.add(data,(err,res1)=>
		{ if(err){console.log(err);};
		if(res1==undefined){console.log('not reading file');console.log('---------------------------------------------------------------');}
		else{
		 console.log('hash is:'+JSON.stringify(res1[0]));
		var client = new UserClient();
		client.send_data([res1[0].hash]);
		res.send('hash='+res1[0].hash+'added succesfully');
			
	} 
		});		
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
