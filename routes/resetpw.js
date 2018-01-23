'use strict';

const express       = require('express');
const router        = express.Router();
const passport      = require( "passport" );
const LocalStrategy = require( "passport-local" );

const db = require( "../controllers/db-mssql.js" );

router.get('/', function(req, res, next) {
    res.render('resetpw', { title: 'Reset password' });
});


router.post( "/", async function( req, res, next ) {
    
    const user = await db.getUserByUsername( req.body.username );

    if ( user ) {
        res.render( "resetnote", { title: "Reset password" } );
    } else { 
        res.redirect( "/resetpw" );
    }
});

async function sendUserResetMail( user ) {
    console.log( user );
}

module.exports = router;
