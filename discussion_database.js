var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

module.exports={
  addDiscussion:function(community_id,title,message,date,username,callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
     var dbo = db.db("communityproject");
      var myobj = {community_id:community_id,username:username,title:title,message:message,date:date};
      dbo.collection("discussions").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
      callback();
    });
  });
  },
  getDiscussions:function(community_id,callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("communityproject");
      dbo.collection("discussions").find({community_id:community_id}).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        callback(result);
      });
       });
  },
}
