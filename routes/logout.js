'use strict';

const express = require('express');
const router = express.Router();
const passport = require( "passport" );

router.get('/', function(req, res, next) {
    console.log( "Logout, set auth to false, kill the session object." );

    req.session.user = null;
    req.session.auth=false;
    req.flash( "danger", "You have been logged out." );

    console.log( req.session );

    res.redirect( "/login" );
});

module.exports = router;
