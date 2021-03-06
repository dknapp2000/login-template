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

db.setPwResetHash = function( user ) {
    debug( "db.setPwResetHash()", user );

    return new Promise( async function( resolve, reject ) {
        const { id, pw_reset_key } = user;

        const updateResult = await db.pool.request()
        .input( "id", mssql.Int, id )
        .input( "pw_reset_key", mssql.VarChar, pw_reset_key )
        .query(`
            UPDATE bld_users SET pw_reset_key = @pw_reset_key WHERE id = @id
        `)

        resolve( {status: "OK" } );
    })
};

db.setNewPassword = function( user ) {
    debug( "db.setPwResetHash()", user );
    const { id, hash } = user;

    return new Promise( async function( resolve, reject ) {
        const { id, password } = user;

        const updateResult = await db.pool.request()
        .input( "id", mssql.Int, id )
        .input( "hash", mssql.VarChar, hash )
        .query(`
            UPDATE bld_users SET password = @hash, pw_reset_key = null WHERE id = @id
        `)

        resolve( {status: "OK" } );
    })    
}

db.confirmEmail = function( id ) {
    console.log( "db.confirmEmail():", id );

    return new Promise( function( resolve, reject ) {
        
        if ( id != parseInt( id ) ) { 
            console.log( "Bad int: ", id );
            return reject( 0 );
        }

        db.pool.request()
        .input( "id", mssql.Int, id )
        .query(`
            UPDATE bld_users SET email_is_verified = 'Y' WHERE id = @id
        `)
        .then( function( result ) {
            if ( result.rowsAffected[0] === 1 ) {
                resolve( true );
            } else { 
                resolve( false );
            }
        })
        .catch( function( err ) {
            const errMsg = { status: "Error", location: "db.confirmEmail", input: id, err: err };
            console.log( err );
            resolve( false );
        })
    })
}

db.connect();

module.exports = {
    getUserByUsername: db.getUserByUsername,
    registerNewUser: db.registerNewUser,
    setPwResetHash: db.setPwResetHash,
    setNewPassword: db.setNewPassword,
    confirmEmail: db.confirmEmail
};
