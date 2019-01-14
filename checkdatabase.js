var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("communityproject");
    var myquery = {email:"manu@gmail.com"};
   newvalues={ "$pull" : { "requests" : { "community" : "coders" } }  }
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      db.close();
    });
  });