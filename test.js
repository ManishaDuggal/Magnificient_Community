//checking username entered by user
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",resave:false,saveUninitialized:false,cookie:{maxAge:1000000*24*60*60}}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.get('/checkuser.js/:str', function(req, res){
    validation.emailValidation(req.params.str,function(result){
        if(result)
        res.send("Username already exists");
        else
        res.send("</br>");
    });

});

//when user entered is submitted
app.post('/submit-adduser.js',function(req,res){

validation.emailValidation(req.body.email,function(result){
    if(result){
        res.redirect('/adduser');
    }
    validation.passwordValidation(req.body.password,function(result){

        if(result){
           var db=require('./users-database');
            db.addUser(req.body.email,req.body.password,req.body.phone,req.body.role,function(){
            var mailer=require('./mail.js');
            mailer.sendmail('manuduggal9@gmail.com',req.body.password);
            res.send("success");
            });
            
        }else
        res.redirect('/adduser');
       
    });
});


});
const db=require('./communities-database');
//test1
app.get('/',function(req,res){
    db.getCommunities(function(result){
        res.render('test',{arr:result});
});
  
});
app.listen(3002);