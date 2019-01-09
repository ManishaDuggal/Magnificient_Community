var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports = {
 addUser:function(email,password,phone,role,callback){

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
     var dbo = db.db("communityproject");
      var myobj = { email:email,password:password,phone:phone,status:"pending",role:role,};
      dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      callback();
    });
  });
 },
  getUsers:function (callback){
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      callback(result);
    });
     });
  },
  findUser:function(obj,callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("communityproject");
        //Find the first document in the users collection:
        dbo.collection("users").findOne(obj, function(err, result) {
          if (err) throw err;
          callback(result);
          db.close();
        });
      });
      
},
updateUser:function(email,newvalue,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    var myquery = { email: email};
    var newvalues = {$set: {password: newvalue} };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callback();
    });
  });
},
updateUserArray:function(useremail,newvalues,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    var myquery = {email:useremail};
    //add to array if it doesnot exist
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("Community added");
      db.close();
    });
  });
  callback();
},
deleteUser:function(email,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    var myquery = { email: email };
    dbo.collection("users").deleteOne(myquery);
  });
  callback();
},

addCommunity:function(useremail,comname,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    var myquery = {email:useremail};
    //add to array if it doesnot exist
   var newvalues = {"$addToSet" : { active_communities : comname} };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("Community added");
      db.close();
    });
  });
  callback();
},


}

