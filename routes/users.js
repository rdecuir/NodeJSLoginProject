var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

router.get('/register', function(req, res, next) {
  res.render('register', {
      'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
      'title': 'Log In',
      'user': req.user,
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
        User.register(new User({
                name: name,
                email: email,
                username: username,
                profileimage: profileImageName
            }), 
            password, 
            function(err, user) {
                if (err) throw err;
                    console.log(user);
            
                passport.authenticate('local')(req, res, function () {       
                    req.flash('success', 'You are now registered and may log in');
                    res.location('/');
                    res.redirect('/');
                });
            });
    }
});

router.post('/login', passport.authenticate('local'), function(req, res) {
        console.log('Authentication Successful');
        req.flash('You have been logged in');
        res.location('/');
        res.redirect('/');
});

router.get('/logout', function(req,res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.render('login', {
      'title': 'Log In',
      'user': req.user,
  })
});

module.exports = router;
