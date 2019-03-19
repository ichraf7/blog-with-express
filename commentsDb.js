var mongodb =require('mongodb');
var mongoose =require("mongoose");
var post=require("./PostDb");
mongoose.connect("mongodb://localhost/myblog",{ useNewUrlParser: true });
var db =mongoose.connection;


var commentSchema =mongoose.Schema({
   content :{
        type:String ,
        required:true,
    },
    postId:{
       type:mongoose.Schema.Types.ObjectId ,
       ref:'post',
       required:true
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'comment'
    }
})

var comment=module.exports=mongoose.model('comment' , commentSchema);

module.exports.createComment=function(newComment,callback )
{
            newComment.save(callback);   
} ;