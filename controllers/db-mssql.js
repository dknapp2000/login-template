'use strict';

const debug = require( "debug" )( "mssql" );
const mssql = require( "mssql" );
const moment = require( "moment" );
const config = require( "../config/config.js" );
let pool;
const db = {};

console.log( config.dbConfig.mssql );

db.connect = async function() {
    pool = await mssql.connect( config.dbConfig.mssql, err => {
        if ( err ) throw err;
        console.log( `Connected to ${config.dbConfig.mssql.server}/${config.dbConfig.mssql.database}`)
        db.pool = pool;
    } );
};

db.getUserByUsername = function( username ) {
    debug( "db.getUserByUsername()", username );
    
    return new Promise( function( resolve, reject ) {

        db.pool.request()
        .input( "username", mssql.VarChar, username )
        .query( `
            SELECT * FROM bld_users WHERE username = @username
        `)
        .then( function( results ) {
            console.log( results );
            resolve( results.recordset[0] )
        })
        .catch( function( err ) {
            const errMsg = { status: "Error", location: "db.getUserByUsername", input: username, err: err };
            reject( errMsg );
        })

    })
};

db.registerNewUser = function( newUser ) {
    debug( "db.registerNewUser()", newUser );
    const { username, firstname, lastname, password } = newUser;

    return new Promise( async function( resolve, reject ) {

        const searchResult = await db.pool.request()
        .input( "username", mssql.VarChar, username )
        .query( `
            SELECT * FROM bld_users WHERE username = @username
        `);
        console.log( searchResult );

        if ( searchResult.rowsAffected > 0 ) {
            return resolve( { status: "Error", message: `Username '${username}' is already in use.` })
        }

        const insertResult = await db.pool.request()
        .input( "username", mssql.VarChar, username )
        .input( "firstname", mssql.VarChar, firstname )
        .input( "lastname",  mssql.VarChar, lastname )
        .input( "password",  mssql.VarChar, password )
        .query( `
            INSERT INTO bld_users ( username, firstname, lastname, password )
                         VALUES ( @username, @firstname, @lastname, @password )
        `);
        console.log( insertResult );

        resolve( { status: "OK", message: `User ${username} added.`} );

    })
};

db.connect();

module.exports = {
    getUserByUsername: db.getUserByUsername,
    registerNewUser: db.registerNewUser           
};
