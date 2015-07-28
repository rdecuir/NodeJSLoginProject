var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('users is alive');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
      'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
      'title': 'Log In'
  });
});

router.post('/register', function(req, res, next) {
    // Get form values
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Check for Image Field
    if(req.body.profileimage) {
        console.log('Uploding Image...');

        // File info
        var profileImageOrginalName = req.body.profileimage.orginalname;
        var profileImageName = req.body.profileimage.name;
        var profileImageOrginalName = req.body.profileimage.mimetype;
        var profileImageOrginalName = req.body.profileimage.path;
        var profileImageOrginalName = req.body.profileimage.extension;
        var profileImageOrginalName = req.body.profileimage.size;
    }
    else {
        // Set default image
        var profileImageOrginalName = 'noimage.png';
    }
    
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);
    
    var errors = req.validationErrors();
    if(errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username
        });
    }
    else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileImageName
        });
        
        // Create user
        User.createUser(newUser, function(err, user) {
            if(err) throw err;
            console.log(user);
        });
        
        req.flash('success', 'You are now registered and may log in');
        res.location('/');
        res.redirect('/');
    }
});

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({username: username}, function(err, user){
        if(err) throw err;
        if(!user) {
            return done(null, false, { message: 'Unknown user ' + username });
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if(isMatch) {
                return done(null, user);
            } 
            else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if(err) return done(err);
        if(!user) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/users/login');
        }
        console.log('Authentication Successful');
        req.flash('You have been logged in');
        res.redirect('/');
    })(req, res, next);
});

router.get('/logout', function(req,res) {
    req.logout;
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});



module.exports = router;
