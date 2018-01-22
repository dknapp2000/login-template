const Database = require( "better-sqlite3" );
const db = new Database( "./db/users.db" );

function getUserByUsername( username ) {

    console.log( "getUserByUsername():", username );

    return new Promise( function( resolve, reject ) {

        try {
            console.log( 'Starting query.' );
            const row = db.prepare( "SELECT * FROM users WHERE username = ? COLLATE NOCASE" ).get( username );
            console.log( row );
            return resolve( row );
        }
            catch (err) {
            console.err( err );
            return reject( err );
        }   

    })

}


function registerNewUser( newUser ) {

  console.log( "registerNewUser()", newUser );

  return new Promise( function( resolve, reject ) {
    const { username, firstname, lastname, password } = newUser;
    console.log( username, firstname, lastname, password );

      const row = db.prepare( "SELECT * FROM users WHERE username = ? COLLATE NOCASE").get( username );
      if ( row ) return resolve( { "msg": "Email is already in use." } )
      
      const stmt = db.prepare( "INSERT INTO users ( username, firstname, lastname, password ) VALUES ( ?,?,?,? )");
      const info = stmt.run( username, firstname, lastname, password );
      console.log( "INSERT: ", info );

      const user = db.prepare( "SELECT * FROM users WHERE username = ? COLLATE NOCASE" ).get( username );
      console.log( user );
      resolve( user );
    })
}

module.exports = {
    getUserByUsername: getUserByUsername,
    registerNewUser: registerNewUser
}
