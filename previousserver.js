var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",resave:false,saveUninitialized:false,cookie:{maxAge:24*60*60}}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

var findInDb=require('./find_in_database.js');

app.get('/login.js',function(req,res){

    if(req.session.isLoggedIn){
       
    }else{
        res.render('login',{});
    }
  
});

app.post('/checkLogin.js',function(req,res){
    findInDb.findUser({email:req.body.email},function(result){
        if(result){
            if(req.body.password===result.password){
                req.session.isLoggedIn=true;
                res.send("You are logged in");
            }else{
                res.redirect('/login.js');
            }
        }
        else{
            res.redirect('/login.js');
        }
        
  });
  });
  
app.get('/', function(req, res){
   if(req.session.isLoggedIn){
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      res.send("loginplease");
   }
});

app.get('/adduser', function(req, res){
    res.sendFile(__dirname+'/public/adduser.html');
   });
app.get('/data.js/:input', function(req, res){
    var i=req.params.input;
   res.send("input "+i);
});
app.listen(3002);