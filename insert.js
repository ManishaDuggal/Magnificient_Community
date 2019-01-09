var Promise = require('promise');
var express = require('express');
var path=require('path');
var app = express();
app.set('view engine','ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var addInDb=require('./add_in_database.js');
var findInDb=require('./find_in_database.js');

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname+'/public/login.html');
  });

app.post('/submit-form.js',function(req, res){
//addInDb.addUser(req.body.email,req.body.password,req.body.phone,req.body.role);
/*
addInDb.getUsers(function(a){
  console.log(a);
  res.render('usertable',{arr:a});
});
*/
   findInDb.findUser({password:req.body.password},function(result){
         if(result)
         res.send(req.body.password);
         else
         res.send("you are out");
   });
  
});


app.listen(3001);

