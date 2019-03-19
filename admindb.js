var mongoose =require("mongoose");
autoIncrement = require('mongoose-auto-increment');
mongoose.connect("mongodb://localhost/myblog",{ useNewUrlParser: true });
var post=require('./PostDb');
var db =mongoose.connection;
autoIncrement.initialize(db);


var adminSchema =mongoose.Schema({
    name:{
        type:String ,
        required: true
    },
    email :{
        type:String,
        required:true 
    },
    password :{
        type:String ,
        required:true
    } ,
    profileImage :{
      type:String ,
      required:true,
    },
    profileImagePath :{
        type:String ,
        required:true,
    },
    posts:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'post'
    }
})

var admin=module.exports=mongoose.model('admin' , adminSchema);
/*
module.exports.createAdmin=function(newAdmin,callback )
{

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newAdmin.password, salt, function(err, hash) {
            newAdmin.password=hash;
            newAdmin.save(callback);   
        });
    });
  
} ;

*/
