const express=require('express');
const router =express.Router();
const Prototype= require('../models/prototype');
const Category= require('../models/category');
const Service= require('../models/service');
var value;
var split;
const mongoose=require('mongoose');
var multer = require('multer');
var fs = require('fs');
var count;
//upload
var DIR = './uploads/'; 
var upload = multer({dest: DIR});
var unzip = require('unzip');
//retrieve data
// router.get('/contacts',(req,res,next) =>{
//     Contact.find(function(err,contacts){
//         res.json(contacts);
//     })
// });

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '/api/upload');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// var cursor = prototype.find();
// console.log(cursor)

router.use(multer({
  dest: DIR,
  rename: function (fieldname, filename) {
      console.log(fieldname, filename)
    return filename;
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
}).any());

router.get('/upload', function (req, res) {
  res.end('file catcher example');
});

router.post('/upload', function (req, res) {
//   upload(req, res, function (err) {
//     if (err) {
//       return res.end(err.toString());
//     }
    console.log(req.files);
    fs.rename('./uploads/'+req.files[0].filename,'./uploads/'+req.files[0].originalname, function(err) {
    if ( err ) console.log('ERROR: ' + err);
    if(req.files[0].originalname.indexOf('zip') !== -1){
        console.log(value)
        fs.createReadStream('uploads/'+req.files[0].originalname).pipe(unzip.Extract({ path: 'src/assets/images/Prototypes/'+value }));
    }
});
        res.end('File is uploaded');
  });


router.get('/categories',(req,res,next) =>{
    Category.find(function(err,categories){
        res.json(categories);
    })
});
router.get('/prototypes',(req,res,next) =>{
    Prototype.find(function(err,prototypes){
        //console.log(prototypes.accronym);
        res.json(prototypes);
    })
});
router.get('/categories/:id',(req,res,next) =>{
    Category.find({id:parseInt(req.params.id)},function(err, results){
    console.log(results); 
    console.log(typeof req.params.id);
     res.json(results);// output all records
})
});
router.get('/prototypes/:id',(req,res,next) =>{
    Prototype.find({id:parseInt(req.params.id)},function(err,results){
         console.log(results); 
         res.json(results);
    })
});
router.get('/prototypes/accronym/:ar',(req,res,next) =>{
    Prototype.find({accronym:req.params.ar},function(err,results){
    //  console.log('AR'+req.params.accronym);
         console.log(results); 
         res.json(results);
    })
});

router.post('/prototypes',(req,res,next)=>{
     Prototype.find(function(err,prototypes){

         count=prototypes.length + 1;
    
    if(req.body.Projecttype=="Mobility"){
        value = 'EM';
    }
    else if(req.body.Projecttype=="AR"){
        value = 'AR';
    }    else if(req.body.Projecttype=="Bot"){
        value = 'AI';
    }    else if(req.body.Projecttype=="Blockchain"){
        value = 'BLC';
    }    else if(req.body.Projecttype=="Social Media Analytics"){
        value = 'SMA';
    }    else if(req.body.Projecttype=="Invision"){
        value = 'IV';
    }    else if(req.body.Projecttype=="VR"){
        value = 'VR';
    }    else if(req.body.Projecttype=="Image Analytics"){
        value = 'IA';
    }    else if(req.body.Projecttype=="IoT"){
        value = 'IOT';
    }    else if(req.body.Projecttype=="3D Printing"){
        value = '3DP';
    }
    console.log(count);
    var newId = 'p'+count;

    let newForm = new Prototype({
         Customer: req.body.Customer,
         title: req.body.PrototypeName,
         domain: req.body.Technology,
         industry: req.body.Vertical,
         category: req.body.Projecttype,
         shortDescription: req.body.Description,
         description: req.body.LDescription,
         id :  count,
         prototype_id :  newId,
         categoryUrl :  req.body.categoryUrl,
         app_icon :  req.body.app_icon,
         accronym :  value,
         uploadDate :  req.body.uploadDate,
         rating :   req.body.rating,
         ratingUrl :  req.body.ratingUrl,
         popularity :  req.body.popularity,
         thumbnail_url : req.body.thumbnail_Url,
         playstore_url : req.body.playstore_Url,
         ios_url :  req.body.ios_Url,
         platform : req.body.platform,
         screenshots : req.body.screenshots
    });
    
    // value = req.body.accronym;
    console.log(value);
    newForm.save((err, prototypes)=>{
        if(err){
            return res.send();
            //res.json({msg:'failed to add form'});
        }
        else{
             res.json({msg:'form has been added'});
        }
    });
   });  
});

router.get('/services',(req,res,next) =>{
    Service.find(function(err,services){
        //console.log(prototypes.accronym);
        res.json(services);
    })
});

router.post('/services',(req,res,next)=>{
    Service.find(function(err,services){

         count_s=services.length + 1;
    
   
    console.log(count_s+"length");
    var newServiceId = 'p'+count_s;

    let serviceForm = new Service({

               cust_name:req.body.cust_name,
                domain:req.body.domain,
                poc:req.body.poc,
                email_address:req.body.email_address,
                problem_statement:req.body.problem_statement,
                low_fidelity:req.body.low_fidelity,
                medium_fidelity:req.body.medium_fidelity,
                high_fidelity:req.body.high_fidelity,
                development:req.body.development,

                // myVar:req.body.myVar,
                // req_id : req.body.req_id,
                // disabled1 :req.body.disabled1,
                // disabled2 : req.body.disabled1,
     details:req.body.details,
                tech_details:req.body.tech_details
    });
    
   serviceForm.save((err,services)=>{
        if(err){
            console.log("result"+services);
            return res.send();
            //res.json({msg:'failed to add form'});
        }
        else{
             res.json({msg:'form has been added'});
        }
    });
   })});  

// //adding data
// router.post('/contact',(req,res,next) => {
// let newContact= new Contact({
// firstName:req.body.firstName,
// lastName:req.body.lastName
// });

// newContact.save((err,contact)=>{
//     if(err){
//         res.json({msg:'Failed to add'});
//     }
//     else{
//         res.json({msg:'data  added successfully'});
//     }
// });
// });

// //deleteing data
// router.delete('/contact/:id',(req,res,next) => {
// Contact.remove({id:req.params.id},function(err,result){
//     if(err){
//         res.json(err);
//     }
//     else{
//          res.json(result);
//     }
// })
// });
module.exports=router;

