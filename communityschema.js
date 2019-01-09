const mongoose = require('mongoose');
mongoose.connect('localhost:27017/communitydata');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
name : {type : String,required : true},
password : {type : String,required : true}
});

const admindata = mongoose.model('admincollection',adminSchema);


model.exports= {
    admindata = admindata,
}