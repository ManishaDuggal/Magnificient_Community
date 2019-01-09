const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const app=express();
app.set('view engine', 'ejs');
const db=require('./communities-database');
// Public Folder
app.use(express.static('./public'));
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
module.exports={
    uploadimage:function(req,res){
        upload(req, res, function(err){
            if(err){
              res.render('createcommunity', {
                msg: err
              });
            } else {
              if(req.file == undefined){
                res.render('createcommunity', {
                  msg: 'Error: No File Selected!'
                });
              } else {
                //entry in communities database
               db.addCommunity(req.body.name,req.body.description,req.file.filename,req.body.permission,req.body.communitymanager,req.session.email,function(){
                db.getCommunities(function(result){
                         console.log(result);
                });
                res.render('createcommunity', {
                  msg: 'File Uploaded!',
                  file: `uploads/${req.file.filename}`
                });     
               });
                
              }
            }
          });
    },
}
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}




