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
    let id = req.cookies.idValue;
    console.log(file);
    callback(null,id+'-'+file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});


router.get('/', function(req, res, next) {
  res.render('dlogin',{title: 'landReg'});
});

router.get('/usr',(req,res)=>{
  //console.log(JSON.stringify(req.cookies));
  //if file_name undefined check the cookie

  var file_name =req.cookies.file_name;
 
 
 console.log('usr get:'+file_name);
 fs.readFile(file_name, (err, data) => {
    data = JSON.parse(data);
    console.log('****'+JSON.stringify(data));
    var field_data = data['data'];
    field_data = field_data[0];
     name = JSON.stringify(field_data.name);
     id   = JSON.stringify(field_data.id);
     //hash = JSON.stringify(field_data.hash);
   

      res.render('dash',{name:name,id:id});

})});

router.get('/regstr',(req,res)=>{

   var key;
   if(req.query.key){key = req.query.key;}
    var count = 0;
 var obj = {filename:[]};
 var file_table = {};
 var json_table = [];
 var test = [];
fs.readdir("../uploads",(err, files)=> {
    if (err) {return console.log('Unable to scan directory: ' + err);} 
    files.forEach( (file)=> {count = count+1;obj.filename.push(file);});
    obj.filename.forEach((file=>{temp = file.split('-')[0];file_table[temp]=file; }));
    
    // var test = [];
    fs.readdir("../userdata",(err, user_files)=> {   
      user_files.forEach((file)=>{
         var global_data = fs.readFileSync('../userdata/'+file).toString();

         global_data = JSON.parse(global_data);
        
      //if(global_data.data[1]!=undefined) Cannot read property '1' of undefined delete the files in userdata and it will work
       
         if(global_data.data[1]!=undefined){global_data.data[0] = Object.assign(global_data.data[0],global_data.data[1]);
        global_data.data.pop();
          // console.log('before:'+JSON.stringify(global_data.data.pop()));
          // console.log('----');
          // console.log('after:'+JSON.stringify(global_data.data));


        }
         json_table.push(global_data);});

    json_table.forEach(x=>{test.push(x.data);})
     for(i=0;i<json_table.length;i++){
      for(j=0;j<Object.keys(file_table).length;j++){
          
              if(Object.keys(file_table)[j]== test[i][0].id){
           
             
            test[i][0].file = Object.values(file_table)[j];
           }}} 
    
     res.render('dash1',{data:test});

              }); 
   
    });

/*fs.readFile(file_name, 'utf8', (err, data)=>{
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

}});*/



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

});

router.post('/usr',(req,res)=>{
  var key = req.body.key; 
  var no = req.body.no; 
 var name = req.body.name;

 res.cookie('idValue',no);
 res.cookie('same_person',true);
 console.log('key=='+key);
 // var obj = {};
 // obj[no] = [];
 var obj = {data:[]}
obj.data.push({id:no,name:name,file:'not available',hash:'not available'});
var jsonData = JSON.stringify(obj);
file_name = '../userdata/'+no+'.json';
res.cookie('file_name',file_name);
console.log('/usr post:'+file_name);
 
  console.log('uploading');
   var dir = '../userdata';

 if (!fs.existsSync(dir)){
     fs.mkdirSync(dir);
 }
fs.writeFile(file_name, jsonData,{ flag: 'w' }, function (err) {
                if (err) {console.log('../userdata folder is not available');throw err};
                console.log('Replaced!');
                
                });                  
                res.send({msg:'connected'});  

                
              }); 

router.post('/usr1',(req,res)=>{
 id = req.cookies.idValue;
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
  

  //  console.log('before ==='+name+area+loc);
  //  if(name == null | name == undefined){dataa = "";}else{dataa=[name,area,loc];}
  //   console.log('---dataa----'+dataa);
  //  fs.appendFile('../userdata',dataa, function (err) {
  // if (err) throw err;})
  //  res.redirect('/');
  var file_name =req.cookies.file_name;
  console.log('/usr2:'+file_name);
  fs.readFile(file_name, 'utf8',(err, data)=>{
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); 
    obj.data.push({property_name:name,property_area:area,property_location:loc}); 
    json = JSON.stringify(obj);
    fs.writeFile(file_name, json, 'utf8', (err)=>{if(err)console.log('userdata.json unavilable')});  
    res.redirect('/');
}});




})


router.post('/regstr',(req,res)=>{
  var key = req.body.key; 
  console.log('//key'+key);
  // var client = new UserClient(key);
  console.log('log in as a registrar')
  res.cookie.key = key;

})



router.post('/hash',(req,res)=>{
  var id = req.body.id;

  fs.readFile('../ipfs-upload/test1', function (err, data) {
  if (err) throw err;
    
  fs.readdir("../userdata",(err, files)=> {   
      files.forEach((file)=>{
     
        if(file.split('.')[0]==id){
    
        var global_data = fs.readFileSync('../userdata/'+file).toString();
        data = data.toString();
         global_data = JSON.parse(global_data);
        global_data.data[0].hash=data;
        
        fs.writeFile("../userdata/"+file,JSON.stringify(global_data),{ flag: 'w' }, function (err) {
          console.log('file is written');
        })

        console.log(JSON.stringify(global_data));
        }
      })})

});res.redirect('back');
});

router.post('/block',(req,res)=>{
var key = req.body.key;
var id  = req.body.id;

  
  fs.readdir("../userdata",(err, files)=> { 
    files.forEach((file)=>{

      if(file.split('.')[0]==id){

       fs.readFile('../userdata/'+file, function (err, data) {  
  if (err) throw err;

 data = JSON.parse(data);
 let name = data.data[0].name;
 let hash = data.data[0].hash;
 let property_name = data.data[1].property_name;
 let property_area = data.data[1].property_area;
 let property_location = data.data[1].property_location;
 console.log([id,name,property_name,property_area,property_location]);
 var client = new UserClient(key,id,name,property_name,property_area,property_location);
  client.send_data([id,name,property_name,property_area,property_location,hash]);
   fs.unlinkSync('../userdata/'+file);

  

 //removeDir("./uploads", function () { console.log("data removed"); });

});}




    });

   });
res.redirect('back');
 });
router.post('/rjct',(req,res)=>{

  var id  = req.body.id;
   fs.readdir("../userdata",(err, files)=> { 
    files.forEach((file)=>{

      if(file.split('.')[0]==id){
        fs.unlink('../userdata/'+file,(err)=>{});
      console.log('../userdata/'+file);
      }})})
   fs.readdir("../uploads",(err, files)=> { 
    files.forEach((file)=>{

      if(file.split('-')[0]==id){
        fs.unlink('../uploads/'+file,(err)=>{});
      }})})
                       
});

router.get('/dd1',async (req,res)=>{
 
  
  //var client = new UserClient(null,null,null,null,null,null);
  var client = new UserClient('a88090bb39f526e0b88553f0502248ad7a7dec986c11d2b8ef536e91d3d080c3' ,'1','1','1','1','1');
  var data = await client.getData();
  console.log('stat1==='+JSON.stringify(data));
   var list = [];
   data.data.forEach(dat=> {
    if(!dat.data) return;
    let decoddat = Buffer.from(dat.data, 'base64').toString();
    console.log('state::::='+decoddat);
    let data1 = decoddat.split(',');
    list.push({
         
         id:data1[0],
         name:data1[1],
         property_name:data1[2],
         property_area:data1[3],
         property_location:data1[4],
         hash:data1[5]
      });



});   
   console.log('dd1 data='+JSON.stringify(list));
     res.render('dd1',{data:list});
})





router.get('/dd2',async (req,res)=>{

  
 var adhar = req.cookies.idValue;
var a = [];
 fs.readdir("../userdata",(err, files)=> { 
    files.forEach((file)=>{

      if(file.split('.')[0]==adhar){
         fs.readFile('../userdata/'+file,(err,data)=>{
         
          let loc =JSON.parse(data).data[1].property_location;
          let area = JSON.parse(data).data[1].property_area;
          a.push({loc:loc,area:area}); 
           var client = new UserClient('a88090bb39f526e0b88553f0502248ad7a7dec986c11d2b8ef536e91d3d080c3' ,'1','1','1','1','1');
           client.getData1(loc,area).then(data=>{



                 var list = [];
                 var userlist = [];
                 var otherslist = [];
                 
                 data.data.forEach(dat=> {

                 if(!dat.data) return;
    let decoddat = Buffer.from(dat.data, 'base64').toString();
    let data1 = decoddat.split(',');
    list.push({
         
         id:data1[0],
         name:data1[1],
         property_name:data1[2],
         property_area:data1[3],
         property_location:data1[4],
         hash:data1[5]
      });
     
});

list.forEach(x=>{
      
     if(x.id!=undefined){if(req.cookies.idValue==x.id){userlist.push(x);}else{otherslist.push(x);}}
    })


res.render('dd2',{usrlst:userlist,othrlst:otherslist}); 
            })
          

         })
         
      } }) 

  })



 
  

 });


router.post('/reqBuy',(req,res)=>{
  var buyerid = req.body.buyerid;
  var buyername = req.body.usrname;
  var sellername = req.body.sellername;
  var prop_name = req.body.prop_name;
  var prop_area = req.body.prop_area;
  var prop_loc = req.body.prop_loc;
 filename = '../transferdata/'+'transfer-'+buyerid+'-'+sellername+'-to'+'.json';
 data = {buyerid:buyerid,buyername:buyername,sellername:sellername,prop_name:prop_name,prop_area:prop_area,prop_loc:prop_loc,sellerid:'not set'}

     fs.writeFile(filename,JSON.stringify(data),{ flag: 'w' }, function (err) {
                if (err) {console.log('../userdata folder is not available');throw err};
                console.log('Replaced!');
                
                });                  
                res.send({msg:'connected'});  

                
              


})
//outer.post('/req_buy_list1',(req,res)=>{let name = req.body.name;res.cookie('idName',name);   })
router.get('/req_buy_list',(req,res)=>{
     
     let name = req.query.name;

     if(name!=undefined){res.cookie('tempName',name);}else{name=req.cookies.tempName;}
     console.log('111111idname='+name+',temp='+req.cookies.tempName);
     var a = [];
     var b = [];
    fs.readdir("../transferdata",(err, files)=> { 
     
    files.forEach((file)=>{
      
          if(file.split('-')[0]=='transfer'){
          
          var global_data = fs.readFileSync('../transferdata/'+file).toString();
          console.log('global_data=='+global_data);
          global_data = JSON.parse(global_data);
          console.log('11');
          if(global_data[0]==undefined){
            console.log('12');
            console.log('seller:'+global_data.sellername);
          if(name && name==global_data.sellername){
            console.log('--------------------*-**-*-');
           a.push(global_data);
          }}
          


}
    });
    console.log('aaaaaaaaaaaaaaa:'+JSON.stringify(a));
    res.render('req_buy',{data:a});
    
  });//res.render('req_buy',{data:b});
    
})
router.post('/req_buy_list',(req,res)=>{
  console.log('running');
  var userid  = req.body.id;
  var clientid= req.body.clientid;
  var name= req.body.name;
     var a = [];
    fs.readdir("../transferdata",(err, files)=> { 
     
    files.forEach((file)=>{

          if(file.split('-')[0]=='transfer'){
              if(file.split('-')[1]==clientid && file.split('-')[2]==name){
                // console.log('file.split('-')[1]==clienti==='+file.split('-')[1]==clientid);
                // console.log('file.split('-')[2]==name======'+file.split('-')[2]==name);
          
          var global_data = fs.readFileSync('../transferdata/'+file).toString();
          global_data = JSON.parse(global_data);
           a.push(global_data);
      
           a[0].clientno = userid;
           file_name = "../transferdata/"+file;
           fs.writeFile(file_name, JSON.stringify(a), 'utf8', (err)=>{if(err)console.log('userdata json unavilable')});
         }

}
});
   console.log('aaaaaaaaa:'+JSON.stringify(a));
});res.redirect('/');
})




router.get('/transfer',(req,res)=>{
  var a = [];
 fs.readdir("../transferdata",(err, files)=> { 
     
    files.forEach((file)=>{ 
    var global_data = fs.readFileSync('../transferdata/'+file).toString();
    global_data = JSON.parse(global_data);
    console.log('2;;;;='+JSON.stringify(global_data));
      console.log('2;;;;[0]='+JSON.stringify(global_data[0]));
    if(global_data[0] && global_data[0].clientno!='not set'){
    console.log('789===:'+global_data[0].clientno);
     a.push(global_data);
  }
    });console.log('abbaa:'+JSON.stringify(a));
    res.render('transfer',{data:a});
  })
 

})
router.post('/chaneg_owner',(req,res)=>{
  var pvtkey = req.body.pvtkey;
  var buyername = req.body.buyername;
  var buyerid = req.body.buyerid;
  var sellername = req.body.sellername;
  var sellerid = req.body.sellerid;
  var prop_name = req.body.prop_name;
  var prop_area = req.body.prop_area;
  var prop_loc = req.body.prop_loc;

var client = new UserClient(key,buyerid,buyername,property_name,property_area,property_location);


UserClient(key,id,name,property_name,property_area,property_location);
client.send_data([buyerid,buyername,sellername,sellerid,property_name,property_area,property_location]);
fs.readdir("../transferdata",(err, files)=> { 
    files.forEach((file)=>{
          if(file.split('-')[1]==buyerid && file.split('-')[2]==sellername){
             fs.unlinkSync('../transferdata/'+file);
          }
     })})


})


module.exports = router;
