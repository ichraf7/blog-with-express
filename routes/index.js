var express = require('express');
var router = express.Router();
var user = require('../userDb');
var admin = require('../admindb');
var  posts=require('../PostDb');
/* GET home page. */
router.get('/', function (req, res, next) {
  posts.find({}).populate('author').populate('category').exec(function (err, result) {
    if (err) throw err
    console.log(result);
    res.render('index', { poste: result });
  })

});
router.get('/about', function (req, res, next) {
  res.render('about');
});
router.get('/contact', function (req, res, next) {
  res.render('contact');
});
router.get('/single-audio', function (req, res, next) {
  res.render('single-audio');
});
router.get('/single-gallery', function (req, res, next) {
  posts.find({}).populate('author').populate('category').exec(function (err, result) {
    if (err) throw err
    console.log(result);
    res.render('newpage', { poste: result });
  })

});
router.get('/single-standard', function (req, res, next) {
  res.render('single-standard');
});
router.get('/style-guide', function (req, res, next) {
  res.render('style-guide');
});
router.get('/style-video', function (req, res, next) {
  res.render('style-video');
});

router.get('/user_register', function (req, res, next) {
  res.render('user_register');
});
/* POST handling */
router.post('/user_register', function (req, res, next) {
  console.log(req.body);
  req.check('confirm', "passsword doesn' t match").equals(req.body.password);
  req.check('name', "name is too short").isLength({ min: 3 });
  var errors = req.validationErrors();
  if (errors) {
    res.render('user_register', { errors: errors });
  }
  else {
    //make sur that email doesn't exist
    user.find({ email: req.body.email }, function (err, new_user) {
      if (new_user.length != 0) {
        var error = {
          location: 'body',
          param: "inputEmail",
          msg: "Email address already registered",
          value: req.body.email
        };
        if (!errors) {
          errors = [];
        }
        errors.push(error);
        res.render('user_register', { errors: errors });
      }
      else {
        admin.find({ email: req.body.email }, function (err, admins) {
          if (admins.length != 0) {
            var error = {
              location: 'body',
              param: "inputEmail",
              msg: "Email address already registered",
              value: req.body.email
            };
            if (!errors) {
              errors = [];
            }
            errors.push(error);
            res.render('user_register', { errors: errors });
          }
          else {
            var newUser = new user({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              date:req.body.date,
              status:req.body.status
            });
            user.createUser(newUser, function (err) {
              if (err) throw err;
              console.log("ok");
            });
            req.session.user = new_user;
            res.render('index', { success: req.body.name });
          }
        });
      }
    });
  }
});

module.exports = router;
