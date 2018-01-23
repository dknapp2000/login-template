'use strict';

const express       = require('express');
const router        = express.Router();
const passport      = require( "passport" );
const LocalStrategy = require( "passport-local" );
const bcrypt        = require( "bcryptjs" );

const db = require( "../controllers/db-sqlite3.js" );

passport.use( new LocalStrategy( 
    async function( username, password, done ) {
        const user = await db.getUserByUsername( username );
        if ( ! user ) {
            console.log( "Username not found." );
            return done( null, null );
        }
        const isValidPassword = validPassword( password, user.password );

        if ( isValidPassword ) {
            console.log( "USERNAME ID : ", user.id );
            return done( null, user );
        }

        console.log( "Password not valid." );
        return done( null, false )
    })
)

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/* GET login page. */
router.get('/', function(req, res, next) {
    console.log( "Login page" );
    res.render('login', { 
        title: 'login',
        info: req.flash( "info" ),
        warning: req.flash( "warning" ),
        success: req.flash( "success" ),
        danger: req.flash( "danger" ),
    });
});

router.post( "/", 
    passport.authenticate( 'local', { failureRedirect: "/login" } ),
    async function( req, res, next ) {
    
    const user = await db.getUserByUsername( req.body.username );
    req.session.user = user;
    req.session.auth = true;

    req.flash( "success", `You are logged in as ${user.firstname}.` );

    console.log( { user: JSON.stringify( user, null, 2 ), reqUser: req.user, reqSession: req.session, auth: req.isAuthenticated() } );
    res.redirect( "/" );
});

function validPassword( password, hash ) {
    
    return new Promise( function( resolve, reject ) {

        bcrypt.compare( password, hash, function( err, res ) {
            if ( err ) throw err;
            console.log( "Password check returns: ", res );
            resolve( res );
        });

    });
}

module.exports = router;
