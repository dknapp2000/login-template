'use strict';

const express = require('express');
const router = express.Router();
const passport = require( "passport" );
const LocalStrategy = require( "passport-local" );
const Database = require( "better-sqlite3" );
const db = new Database( "./db/users.db" );
const bcrypt = require( "bcrypt" );
const saltRounds = 5;

/* GET login page. */
router.get('/', async function(req, res, next) {
  res.render('register', { title: 'register' });

});

router.post( "/", async function( req, res, next ) {
 
  const result = await registerNewUser( req.body );

  console.log( result );
  
  res.json( result );
});

module.exports = router;

async function registerNewUser( newUser ) {
  console.log( "registerNewUser()", newUser );
  return new Promise( function( resolve, reject ) {
    const { username, firstname, lastname, password } = newUser;
    console.log( username, firstname, lastname, password );

      const row = db.prepare( "SELECT * FROM users WHERE username = ?").get( username );
      if ( row ) return resolve( { "msg": "Email is already in use." } )
      
      const stmt = db.prepare( "INSERT INTO users ( username, firstname, lastname, password ) VALUES ( ?,?,?,? )");
      const info = stmt.run( username, firstname, lastname, password );
      console.log( "INSERT: ", info );

      const user = db.prepare( "SELECT * FROM users WHERE username = ?" ).get( username );
      console.log( user );
      resolve( user );
    })
  }
