'use strict';

const ENV = "dev";

const config = {
    "dev" : {
        env: ENV,
        envName: "development",
        port: 3501,
        cookieSecret: "thisIsMyDevSecret",
        dbtype: "sqlite3",
        dbname: "./db/users.db",
        saltRounds: 10,
        smtpConfig: {
            host: "smtpext.electrolux-na.com",
            port: 25,
            secure: false,
        }
    },
    "uat" : {
        env: ENV,
        envName: "UAT",
        port: 3502,
        cookieSecret: "thisIsMyUATSecret",
        dbtype: "sqlite3",
        dbname: "./db/users.db",
        saltRounds: 10,
        smtpConfig: {
            host: "smtpext.electrolux-na.com",
            port: 25,
            secure: false,

        }
    },
    "prod" : {
        env: ENV,
        envName: "production",
        port: 3500,
        cookieSecret: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
        dbtype: "sqlite3",
        dbname: "./db/users.db",
        saltRounds: 10,
        smtpConfig: {
            host: "smtpext.electrolux-na.com",
            port: 25,
            secure: false,

        }
    }
};

module.exports = config[ENV];
