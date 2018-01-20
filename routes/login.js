'use strict';

const express = require('express');
const router = express.Router();
const passport = require( "passport" );
const LocalStrategy = require( "passport-local" );
const sqlite = require( "better-sqlite3" );

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

    db.each( "SELECT * FROM users WHERE username = ?", [ username ], function( err, row ) {
      if ( err ) return reject( err );
      if ( ! row ) return resolve( null, null );
      return resolve( null, row );
    })

  })

}