'use strict';

// Config
const config        = require( "../config/config.js" );

// Modules
const express       = require('express');
const router        = express.Router();

// DB
const db = require( "../controllers/db-mssql.js" );

router.get('/:id', async function(req, res, next) {
    const { id } = req.params;

    const emailConfirmed = await db.confirmEmail( id );

    if ( emailConfirmed ) {
        req.flash( "success", "Your email address has been confirmed." );
    } else {
        req.flash( "error", "Sorry, but we did not find that email address for confirmation.")
    }

    res.render('confirmemail', { 
        title: 'Email confirmed',
        info: req.flash( "info" ),
        warning: req.flash( "warning" ),
        success: req.flash( "success" ),
        error: req.flash( "error" ),        
    });

});

module.exports = router;
