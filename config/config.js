'use strict';

const ENV = "dev";

const config = {
    "dev" : {
        env: ENV,
        envName: "development",
        port: 3501,
        cookieSecret: "thisIsMyDevSecret"
    },
    "uat" : {
        env: ENV,
        envName: "UAT",
        port: 3502,
        cookieSecret: "thisIsMyUATSecret" 
    },
    "prod" : {
        env: ENV,
        envName: "production",
        port: 3500,
        cookieSecret: "da39a3ee5e6b4b0d3255bfef95601890afd80709"
    }
};

module.exports = config[ENV];
