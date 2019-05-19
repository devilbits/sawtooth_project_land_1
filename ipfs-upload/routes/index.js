var express = require('express');
var router = express.Router();
var IPFS   = require('ipfs-http-client');
var fs = require('fs');
//var server = require('diet');
//var app = server()



ipfs = IPFS('localhost','5001',{protocol:'http'});





router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload',(req,res,next)=>{
	data = req.files.myfile.data;
	console.log(data.toString());
	
	ipfs.add(data,(err,res1)=>
		{ if(err){console.log(err);};
		if(res1==undefined){console.log('not reading file');}
		else{
		 console.log('hash is:'+JSON.stringify(res1[0]));
                 
                fs.writeFile('test1',res1[0].hash,{ flag: 'w' }, function (err) {
        if (err) {console.log('../userdata folder is not available');throw err};  
    });                     
                 



                            
               
                res.redirect('back');} 
		});




	

});



module.exports = router;
