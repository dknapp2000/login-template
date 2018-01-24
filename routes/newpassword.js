'use strict';

const config        = require( "../config/config.js" );
const express       = require('express');
const router        = express.Router();
const passport      = require( "passport" );
const db            = require( "../controllers/db-mssql.js" );
const bcrypt        = require( "bcryptjs" );

router.get( "/:id/:hash", function( req, res ) {
    const { id, hash } = req.params;
    console.log( "ID/HASH: ", id, hash );
    res.render( "newpassword", { 
        title: "Reset password", 
        id: id, 
        hash: hash,
        info: req.flash( "info" ),
        warning: req.flash( "warning" ),
        success: req.flash( "success" ),
        error: req.flash( "error" ),
    } );
});

router.post('/', function(req, res, next) {
    console.log( "Set new password for user" );
    console.log( "POST: /newpassword", req.body );
    let { password, confirmpassword, id, hash } = req.body;

    password = password.trim();
    confirmpassword = confirmpassword.trim();

    if ( password !== confirmpassword ) {
        req.flash( "error", "Password and confirmation passwords must match" );
        return res.redirect( `/newpassword/${id}/${hash}` );
    }

    if ( password.match( /^\s*$/ ) ) {
        req.flash( "error", "Please enter a valid password." );
        return res.redirect( `/newpassword/${id}/${hash}` );
    }

    if ( password.length < 5 || ! password.match( /\d/ ) || ! password.match( /\w/ ) || password.match( /\s/ ) ) {
        req.flash( "error", "Password must be 8 characters long, containing numbers, letters, and stuff." );
        return res.redirect( `/newpassword/${id}/${hash}` );
    }

    bcrypt.hash( password, config.saltRounds, async function( err, hash ) {
        await db.setNewPassword( { id: id, hash: hash } );

        res.redirect( "/login" );
    })

});

module.exports = router;
