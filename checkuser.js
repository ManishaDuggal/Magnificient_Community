var findInDb=require('./find_in_database.js');
module.exports={
  emailValidation:function(i,callback){
    var query = { email: i};
    findInDb.findUser(query,function(result){
           if(result){
            callback(1);
           }else{
            callback(0);
           }
    });
  },
  passwordValidation:function(i,callback){
       if(i.length<9){
         callback(0);
       }else{
        callback(1);
       }
  },
  
}