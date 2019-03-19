var mongodb =require('mongodb');
var mongoose =require("mongoose");
var category=require("./categoryDb");
var comment=require("./commentsDb");
var admin=require("./admindb");
mongoose.connect("mongodb://localhost/myblog",{ useNewUrlParser: true });


var db =mongoose.connection;
var postSchema =mongoose.Schema({
    title:{
        type:String ,
        required: true
    },
    category :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category', 
        required:true 
    },
    author :{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'admin',
        required:true
    } ,
   date :{
      type:Date ,
      required:true,
      default:Date.now 
    },
   content :{
        type:String ,
        required:true,
    },
    imagePath:{
        type:String ,
        required:true
    },
    comments:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'comment',
    },
    nombre_views:{
        type:Number,
        min:0,
    },
    likes :{
      type:Number,
      min:0,
    }
})

var post=module.exports=mongoose.model('post' , postSchema);

module.exports.createPost=function(newPost,callback )
{
            newPost.save(callback);   
} ;

