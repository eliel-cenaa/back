
    var mongoose = require('mongoose')
    , single_connection
    , env_url = {
        "test": "mongodb://localhost/ntalk_test"
        , "development": "mongodb://localhost/ntalk"
    }
    ;
    module.exports = function() {
        var env = process.env.NODE_ENV || "development"
        , url = env_url [env];
        if(!single_connection) {
            single_connection = mongoose.connect(url);
        }
        return mongoose.connect(url);
    };
