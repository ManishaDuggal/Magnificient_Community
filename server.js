var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",resave:false,saveUninitialized:false,cookie:{maxAge:1000000*24*60*60}}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
var db=require('./users-database.js');
const cdb=require('./communities-database');
var ddb=require('./discussion_database.js');
var validation=require('./checkuser.js');
const fileupload=require('./upload');
//login form
 app.get('/login.js', function(req, res){
    res.render('login',{});
 });
 //check login details on submission
 app.post('/checklogin.js', function(req, res){
    db.findUser({email:req.body.email,password:req.body.password},function(result){
        if(result){
            //if email and password exists
            req.session.isLoggedIn=true;
            req.session.email=req.body.email;
            req.session.role=result.role;
            res.redirect('/adminhome');
        }else{
            //again send login page
            res.render('login',{});
        }
     })
 });
 //if user clicks on logout button
 app.get('/logout', function(req, res){
     req.session.destroy();
     res.render('login',{});
 });
//admin functions
//form to add a user 
app.get('/adduser', function(req, res){
    if(req.session.isLoggedIn){
        if(req.session.role=="admin")
        res.render('adduser',{str:"welcome"});
        else
        res.send("<h1>You are not admin</h1>");
    }else{
        res.render('login',{});
    }
    
 });
 //checking username entered in form and giving suggessions
app.get('/checkuser.js/:str', function(req, res){
    if(req.session.isLoggedIn){
        validation.emailValidation(req.params.str,function(result){
            if(result)
            res.send("Username already exists");
            else
            res.send("</br>");
        });
    }else{
        res.render('login',{});
    }
       
    
});
 //when user entered is submitted
app.post('/submit-adduser.js',function(req,res){

    if(req.session.isLoggedIn){
        //checking user already exists
        validation.emailValidation(req.body.email,function(result){
           // result is 0 or 1
            if(result){
                res.redirect('/adduser',{str:"Email already exists.Please enter a different email."});
            }
            validation.passwordValidation(req.body.password,function(result){
    
                if(result){
                    db.addUser(req.body.email,req.body.password,req.body.phone,req.body.role,function(){
                    var mailer=require('./mail.js');
                    mailer.sendmail('manuduggal9@gmail.com',req.body.password,function(err){
                            if(err){
                                res.render('adduser',{str:"Unable to send mail to user.But user is successfully added."});
                            } else{
                                res.render('adduser',{str:"User successfully added and email is sent to user."});
                            }
                    });
                   
                    });
                    
                }else
                res.render('adduser',{str:"Enter a strong password"});
                //res.redirect('/adduser');
               
            });
        });
        res.render('adduser',{str:"User successfully added and email is sent to user."});
    }else{
        res.render('login',{});
    }
    
});
 
 //delete user
 app.get('/deleteuser/:str',function(req,res){
    if(req.session.isLoggedIn){
        db.deleteUser(req.params.str,function(){
            db.getUsers(function(result){
                res.redirect('/userslist');
              });
           });
    }else{
        res.render('login',{});
    }
   
 });
 //adminhome
 app.get('/adminhome', function(req, res){

    if(req.session.isLoggedIn){
        db.findUser({email:req.session.email},function(result){
            res.render('adminhome',{role:req.session.role,arr:result});
         })
    }else{
        res.render('login',{});
    }
    
  });

 //admins userslist
 app.get('/userslist', function(req, res){
    if(req.session.isLoggedIn){
        if(req.session.role=="admin")
        {
            db.getUsers(function(result){
                console.log(result);
               res.render('datatable',{str:"",arr:result});
              });
        }else
        {
            res.send("<h1>You are not admin</h1>")
        }
        
    }else{
        res.render('login',{});
    }  
    
  });
  //password form
  app.get('/password', function(req, res){
    if(req.session.isLoggedIn){
        res.render('changepassword',{role:req.session.role});
    }else{
        res.render('login',{});
    }
  });
  
  app.post('/changepassword',function(req,res){
    if(req.session.isLoggedIn){
        if(req.body.password1==req.body.password2){
            db.updateUser(req.session.email,req.body.password1,function(){
              res.render('changepassword',{role:req.session.role});
            })
      }
    }else{
        res.render('login',{});
    }
       
  });

//create community form
app.get('/createcommunity', function(req, res){
    if(req.session.isLoggedIn){
        res.render('createcommunity',{role:req.session.role});
    }else{
        res.render('login',{});
    }
});
//saving community in database using upload.js file
app.post('/upload', (req, res) => {
    if(req.session.isLoggedIn){
        fileupload.uploadimage(req,res);
    }else{
        res.render('login',{});
    }
});
//communities list
app.get('/communitieslist',function(req,res){
    if(req.session.isLoggedIn){
        cdb.getCommunities(function(result){
            res.render('communitylist',{role:req.session.role,arr:result,curr_user:req.session.email});
      });
    }else{
        res.render('login',{});
    }
   
});
//requestforcommunity
app.get('/requesttoadd/:str', function(req, res){
    if(req.session.isLoggedIn){
        cdb.findCommunity({name:req.params.str},function(result){
             if(result.permission=="yes"){
                var obj={"$push" : {
                    "requests" : {
                      "user" : req.session.email,
                      "community" : req.params.str,
                    }
                  }
                }
                 db.updateUserArray(result.community_manager,obj,function(){
                    res.send("Request is sent to the community manager");
                 });
             }else{
                cdb.addUser(req.params.str,req.session.email,function(){
                    db.addCommunity(req.session.email,req.params.str,function(){
                        res.send("You are member of "+req.params.str+" community now");
                    });
                });
             }
        });
        
    }else{
        res.render('login',{});
    }
          
});
//mycommunitieslist
app.get('/mycommunities', function(req, res){
    if(req.session.isLoggedIn){
        db.findUser({email:req.session.email},function(result){
          //  console.log(result.active_communities);
            if(result.active_communities)
            res.render('mycommunities',{role:req.session.role,arr:result.active_communities});
            else
            res.render('mycommunities',{role:req.session.role,arr:[]});
         });
    }else{
        res.render('login',{});
    }    
  });
  app.get('/communitypage/:str',function(req,res){
    if(req.session.isLoggedIn){
        cdb.findCommunity({name:req.params.str},function(result){
            res.render('communitytemplate',{role:req.session.role,obj:result});
          });
    }else{
        res.render('login',{});
    }
    
  });
  app.get('/communityusers/:str',function(req,res){
    if(req.session.isLoggedIn){
        cdb.findCommunity({name:req.params.str},function(result){
            res.render('communityusers',{role:req.session.role,arr:result.active_users});
          });
    }else{
        res.render('login',{});
    }
    
  });
  app.get('/requests',function(req,res){
    if(req.session.isLoggedIn){
        db.findUser({email:req.session.email},function(result){
            if(result.requests)
        res.render('requests',{role:req.session.role,arr:result.requests});
        else
        res.render('requests',{role:req.session.role,arr:[]});
        });
    }else{
        res.render('login',{});
    }
    
  });
  app.get('/handlerequest/:username/:commname/:flag',function(req,res){
    if(req.session.isLoggedIn){

       if(req.params.flag=="accept"){
        cdb.addUser(req.params.commname,req.params.username,function(){
           // console.log(req.params.commname+" "+req.params.username)
            db.addCommunity(req.params.username,req.params.commname,function(){
                db.deleteRequest(req.session.email,req.params.commname,function(){
                    res.redirect('/requests');
                   });
            });
        });
       }else{
        db.deleteRequest(req.session.email,req.params.commname,function(){
            res.redirect('/requests');
           });
       }
      
    }else{
        res.render('login',{});
      }
    
  });
 let temp="";
  app.get('/display_discussion',function(req,res){
      console.log(temp);
      ddb.getDiscussions(temp,function(result){
        res.render('discussion',{role:"admin",arr:result,community_id:temp,username:req.session.email});
      })
  });

  app.get('/discussion/:com_id',function(req,res){
    if(req.session.isLoggedIn){
        temp=req.params.com_id;
        res.redirect('/display_discussion');
    }else{
        res.render('login',{});
    }
      
  });
  app.post('/add_discussion',function(req,res){
    if(req.session.isLoggedIn){
        var curr_date=new Date().toISOString().slice(0,10);
        ddb.addDiscussion(req.body.community_id,req.body.title,req.body.message,curr_date,req.session.email,function(){
            res.send({"good":"goodgirl"});
        });
    }else{
        res.render('login',{});
    }
    
  });
app.listen(3002);