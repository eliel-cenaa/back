
var mongoose = require('mongoose');
module.exports = function(app) {
   var db = require ('../lib/db_connect')()
   , schema = require ('mongoose').Schema;

    var contato = schema({
        nome: String
      , email: String  
    });
    var usuario = schema({
        nome: {type: String, required: true}
      , email: {type: String, required: true
                         , index: {unique: true}}
      , contatos: [contato]                   
    });

    return mongoose.model('usuarios' , usuario);
};