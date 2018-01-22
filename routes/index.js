var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Express', 
        user: JSON.stringify( req.session ),
        info: req.flash( "info" ), 
        warning: req.flash( "warning" ),
        success: req.flash( "success" ),
        error: req.flash( "error" )
    });
});

module.exports = router;
