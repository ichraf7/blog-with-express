var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/myblog", { useNewUrlParser: true });
var db = mongoose.connection;


var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        default:"inactive"
    }

})

var user = module.exports = mongoose.model('user', userSchema);
/*
module.exports.createUser = function (newUser, callback) {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });

};*/
