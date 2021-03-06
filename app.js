
// Config
const config            = require( "./config/config.js" );

// Modules
const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const bodyParser        = require('body-parser');
const passport          = require( "passport" );
const cookieParser      = require( "cookie-parser" );
const cookieSession     = require( "cookie-session" );
const flash             = require( "connect-flash" );

// routes
const index             = require('./routes/index');
const users             = require('./routes/users');
const login             = require( "./routes/login" );
const register          = require( "./routes/register" );
const logout            = require( "./routes/logout" );
const resetpw           = require( "./routes/resetpw" );
const newpassword       = require( "./routes/newpassword.js" );
const confirmemail      = require( "./routes/confirmemail.js" );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger(':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
/*
 * Set up the cookie-session in req.session
 */
app.use( cookieSession( {
  name: "session",
  secret: config.cookieSecret,
  maxAge: config.cookieDurationInHours * 60 * 60 * 1000
}));
//
// Make sure that the cookie is updated at least every minute so that the expiration time will be updated
//
app.use( function( req, res, next ) {
  req.session.lastCall = Math.floor(Date.now() / 60e3);
  next();
});

app.use( flash() );
app.use( passport.initialize() );

// app.use( function( req, res, next ) { 
//     console.log( "Session Cookie     : ", req.session );
//     next();
// });

app.use( "/login", login );
app.use( "/register", register );
app.use( "/logout", logout );
app.use( "/resetpw", resetpw );
app.use( "/newpassword", newpassword );
app.use( "/confirmemail", confirmemail );

app.use( function( req, res, next ) {
    if ( req.session && req.session.auth ) {
        return next();
    }
    console.log( "Not authorized, redirecting to login page." );
    res.redirect( "/login" );
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
