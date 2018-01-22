'use strict';

const express = require('express');
const router = express.Router();
const passport = require( "passport" );

router.get('/', function(req, res, next) {
    console.log( "Logout, set auth to false, kill the session object." );
    //req.session.auth = false;
    req.session = null;
    res.render('login', { title: 'login' });
});

module.exports = router;
