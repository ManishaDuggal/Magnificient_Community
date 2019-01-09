var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports={

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
          
    }
}