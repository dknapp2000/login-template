'use strict';

const express       = require('express');
const router        = express.Router();
const passport      = require( "passport" );
const LocalStrategy = require( "passport-local" );
const nodemailer    = require( "nodemailer" );
const config        = require( "../config/config.js" );
const hbs           = require( "handlebars" );
const fs            = require( "fs" );
const emailBody     = fs.readFileSync( "./emails/pwresetemail.hbs", "utf8" );
const randomString  = require( "../utils/randomString.js" );

const template      = hbs.compile( emailBody );

const db = require( "../controllers/db-mssql.js" );

router.get('/', function(req, res, next) {
    res.render('resetpw', { 
        title: 'Reset password',
        info: req.flash( "info" ),
        warning: req.flash( "warning" ),
        success: req.flash( "success" ),
        error: req.flash( "error" ),        
    });
});


router.post( "/", async function( req, res, next ) {
    const username = req.body.username;

    if ( username.match( /^\s*$/ ) ) {
        req.flash( "error", "Please enter a username/email." );
        return res.redirect( "/resetpw" );
    }

    const user = await db.getUserByUsername( username );
    
    if ( user ) {
        user.pw_reset_key = randomString(10);
        const emailHTML = template( { user: user, url: config.url } );
        console.log( "USER: ", user );
        db.setPwResetHash( user );
        sendUserResetMail( user, emailHTML );
        res.render( "resetnote", { title: "Reset password" } );
    } else { 
        req.flash( 'warning', `Your username/email '${username}' was not found.`)
        res.redirect( "/resetpw" );
    }
});

async function sendUserResetMail( user, emailHTML ) {
    console.log( "sendUserResetMail", user );
    console.log( "smtp: ", config.smtpConfig );

    const transporter = nodemailer.createTransport( config.smtpConfig );

    const mailOpts = {
        from: "noreply@electrolux.com",
        to: user.username,
        subject: "Password reset request",
        html: emailHTML
    };

    transporter.sendMail( mailOpts, ( err, info ) => {
        if ( err ) console.log( err );
        console.log( info );
    })
}

module.exports = router;
