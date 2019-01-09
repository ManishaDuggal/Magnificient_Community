// Init app
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const fileupload=require('./upload');
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', function(req, res){
    res.render('createcommunity');
});

app.post('/upload', (req, res) => {
  fileupload.uploadimage(req,res);
});
const port = 3002;

app.listen(port, () => console.log(`Server started on port ${port}`))