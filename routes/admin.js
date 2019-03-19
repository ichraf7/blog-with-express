var express = require('express');
var router = express.Router();
var postes = require('../PostDb');
var category = require('../categoryDb');
var expressValidator = require('express-validator');
var mongodb = require('mongodb');
var mongoose = require("mongoose");
var admin = require('../admindb');
var user = require('../userDb');
mongoose.connect("mongodb://localhost/myblog", { useNewUrlParser: true });
const multer = require('multer');
//uploading image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
//specify extension of files
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    //handling error of extensions
    req.fileValidationError = "Forbidden extension";
    return cb(null, false, req.fileValidationError);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


/* GET admin listing. */
router.get('/', function (req, res, next) {
  res.render('signin');
});
router.get('/management', function (req, res) {
  res.render('management');
});

router.get('/members', function (req, res) {
  user.find({}, function (err, users) {
    if (err) throw err;
    else {
      res.render('members', { users: users });
    }
  })

});

router.get('/allCategories', function (req, res) {
  category.find(function (err, categories) {
    if (err) {
      console.log(err)
    }
    else {
      res.render('allCategories', { categories: categories });
    }
  })
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/test', function (req, res, next) {
  res.render('test');
});

router.get('/addCategory', function (req, res) {
  res.render('addCategory');
});

router.get('/allPosts', function (req, res) {
  postes.find({}).populate('author').populate('category').exec(function (err, result) {
    if (err) throw err
    console.log(result);
    res.render('allPosts', { poste: result });
  })

});
router.get('/home', function (req, res) {
  postes.find({}).populate('author').populate('category').exec(function (err, posts) {
    if (err) throw err
    console.log(posts);
    res.render('home', { posts: posts });
  })
});
router.get('/addPost', function (req, res) {
  admin.find({}, function (err, admins) {
    if (err) console.log(err);
    category.find({}, function (err, categories) {
      if (err) throw err
      res.render('addPost', { admins: admins, categories: categories });
    })
  })
});
//handling post request

router.post('/addPost', upload.single('postImage'), function (req, res) {
  console.log(req.body);
  req.check('admin', "author should not be empty").not().isEmpty();
  req.check('title', "title  should not be empty ").not().isEmpty();
  req.check('content', " body should not be empty").not().isEmpty();
  req.check('category', " category should not be empty").not().isEmpty();

  error = req.validationErrors();
  if (req.fileValidationError) {
    var erreur = {
      location: 'body',
      param: "inputFile",
      msg: req.fileValidationError,
      value: req.fileValidationError
    };
    if (!error) {
      error = [];
    }
    error.push(erreur);
  }
  if (error) {
    res.render('addPost', { errors: error });
  }
  else if (!error) {
    var aut = req.body.admin.toString();
    var newPost = new postes({
      title: req.body.title,
      content: req.body.content,
      author: aut,
      category: req.body.category,
      imagePath: req.file.path,
    });
    postes.createPost(newPost, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        res.render('management');
      }
    });
  }
})

router.post('/allCategories', function (req, res) {
  console.log(req.body);
  req.check('category', 'this field should not be empty').not().isEmpty();
  errors = req.validationErrors();
  category.find(function (err, categories) {
    //find if category alredy exist
    const result = categories.find(item => item.name === req.body.category);
    //if error exist then push it error table 
    if (result) {
      var error = {
        location: 'body',
        param: "inputCategory",
        msg: "category already exist",
        value: req.body.category
      };
      if (!errors) {
        errors = [];
      }
      errors.push(error);
    }
    if (errors) {
      //send errors to addacategory page to enter another category
      res.render('allCategories', { erreur: errors });
    }
    //if error don't exist create new category then stored in the database
    else if (!errors) {
      var newCategory = new category({
        name: req.body.category
      });
      category.createCategory(newCategory, function (err) {
        if (err) {
          console.log(err);
        }
        res.render("home");
      })
    }
  });
});

router.post('/register', upload.single('profile'), function (req, res, next) {
  req.check('passwordconfirm', "passsword doesn' t match").equals(req.body.password);
  req.check('name', "name is too short").isLength({ min: 3 });
  var errors = req.validationErrors();
  if (req.fileValidationError) {
    var error = { location: 'body', param: "inputFile", msg: req.fileValidationError, value: req.fileValidationError };
    if (!errors) {
      errors = [];
    }
    errors.push(error);
  }
  if (errors) {
    res.render('register', { errors: errors });
  }
  else {
    //make sur that email doesn't exist
    admin.find({ email: req.body.email }, function (err, new_admin) {
      if (new_admin.length != 0) {
        var error = { location: 'body', param: "inputEmail", msg: "Email address already registered", value: req.body.email };
        if (!errors) {
          errors = [];
        }
        errors.push(error);
        res.render('register', { errors: errors });
      }
      else {
        var newAdmin = new admin({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          profileImage: req.file.filename,
          profileImagePath: req.file.path
        });
        admin.createAdmin(newAdmin, function (err) {
          if (err) throw err;
          console.log("ok");
        });
        req.session.admin = new_admin;
        res.render('management', { success: req.body.name });
      }
    });
  }
});

module.exports = router;
