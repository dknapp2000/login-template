'use strict';

const config        = require( "../config/config.js" );
const express       = require('express');
const router        = express.Router();
const passport      = require( "passport" );
const LocalStrategy = require( "passport-local" );
const db            = require( "../controllers/db-mssql.js" );
const bcrypt        = require( "bcryptjs" );

/* GET login page. */
router.get('/', async function(req, res, next) {
  console.log( "REQ.SESSION: ", req.session );
  console.log( "ISAUTH     : ", req.isAuthenticated() );
  res.render('register', { title: 'register' });

});

router.post( "/", async function( req, res, next ) {
    let user = req.body; 
  
    const hash = await cryptit( user.password );
    user.password = hash;

    console.log( "User: ", user );
    user = await db.registerNewUser( user );
    console.log( "User: ", user );

    res.render( "login", { title: "login",  user: user } )
});

function cryptit( password ) {
    return new Promise( function( resolve, reject ) {
        bcrypt.hash( password, config.saltRounds, function( err, hash ) {
            if ( err ) return reject( err );
            return resolve( hash );
        })

    });
}

module.exports = router;
