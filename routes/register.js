'use strict';

const config        = require( "../config/config.js" );
const express       = require('express');
const router        = express.Router();
const passport      = require( "passport" );
const LocalStrategy = require( "passport-local" );
const db            = require( "../controllers/db-mssql.js" );
const bcrypt        = require( "bcryptjs" );
const nodemailer    = require( "nodemailer" );
const hbs           = require( "handlebars" );
const fs            = require( "fs" );

const emailBody     = fs.readFileSync( "./emails/confirmemail.hbs", "utf8" );

const template      = hbs.compile( emailBody );

/* GET login page. */
router.get('/', async function(req, res, next) {
  console.log( "REQ.SESSION: ", req.session );
  console.log( "ISAUTH     : ", req.isAuthenticated() );
  res.render('register', {
       title: 'register',
       info: req.flash( "info" ),
       warning: req.flash( "warning" ),
       success: req.flash( "success" ),
       error: req.flash( "error" ),
    });

});

router.post( "/", async function( req, res, next ) {
    let user = req.body; 
  
    const hash = await cryptit( user.password );
    user.password = hash;

    const result = await db.registerNewUser( user );

    // fetch the new row from the database
    const userRow = await db.getUserByUsername( user.username );

    if ( result.status === "OK" ) {
        const emailHTML = template( { user: userRow, url: config.url } );
        sendEmainConfirmation( userRow, emailHTML );

        req.flash( "info", "Before logging in you must verify your email address." );
        req.flash( "info", `An email has been sent to ${user.username}, please respond before attempting to login.` );
        res.redirect( "/login" );
    } else {
        req.flash( "error", result.message );
        res.redirect( "/register" );
    }

});

function cryptit( password ) {
    return new Promise( function( resolve, reject ) {
        bcrypt.hash( password, config.saltRounds, function( err, hash ) {
            if ( err ) return reject( err );
            return resolve( hash );
        })

    });
}

async function sendEmainConfirmation( user, emailHTML ) {
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
