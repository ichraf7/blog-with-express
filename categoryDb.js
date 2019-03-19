var mongoose =require("mongoose");
mongoose.connect("mongodb://localhost/myblog",{ useNewUrlParser: true });


var db =mongoose.connection;
var categorySchema =mongoose.Schema({
    name:{
        type:String ,
        required: true
    },
})

var category=module.exports=mongoose.model('category' , categorySchema);

module.exports.createCategory=function(newCategory,callback )
{
        newCategory.save(callback);   
   
} ;