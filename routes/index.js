var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.user) {
        res.redirect('/users/login');
    }
    res.render('index', { title: 'Members', user: req.user});
});

module.exports = router;
