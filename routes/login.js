'use strict';

const express = require('express');
const router = express.Router();
const passport = require( "passport" );
const LocalStrategy = require( "passport-local" );
const Database = require( "better-sqlite3" );
const db = new Database( "./db/users.db" );

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.post( "/", function( req, res, next ) {
    res.json( req.body );
});

module.exports = router;

async function getUserByUsername( username ) {
  return new Promise( function( resolve, reject ) {

    const user = db.prepare( "SELECT * FROM users WHERE username = ?" ).get( username );
    if ( ! user ) return reject( user );
    console.log( user );
    return reject( user );

  })

}