var express             = require('express');
var path                = require('path');
var favicon             = require('serve-favicon');
var logger              = require('morgan');
var bodyParser          = require('body-parser');
const passport          = require( "passport" );
const cookieParser      = require( "cookie-parser" );
const cookieSession     = require( "cookie-session" );
var index               = require('./routes/index');
var users               = require('./routes/users');
const login             = require( "./routes/login" );
const register          = require( "./routes/register" );
const logout            = require( "./routes/logout" );
const config            = require( "./config/config.js" );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
 * Set up the cookie-session in req.session
 */
app.use( cookieSession( {
  name: "session",
  secret: config.cookieSecret,
  maxAge: 2 * 60 * 60 * 1000
}));
/*
 * Prepare for passport authentication
 */
app.use( passport.initialize() );

app.use( function( req, res, next ) { 
    console.log( "Session Cookie     : ", req.session );
    next();
});

app.use( "/login", login );
app.use( "/register", register );
app.use("/logout", logout );

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
