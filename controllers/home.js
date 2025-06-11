module.exports = function(app) {
    var banco_dados = app.models.usuario;
    var HomeController = {
        index: function(req, res) {
            res.render('home/index');
        },
        login: function(req, res) {
            var query = {email: req.body.usuario.email};
            banco_dados.findOne(query).select('_id email').then(function(usuario){                     
                     if(usuario) {
                         req.session.usuario = usuario;
                         res.redirect('/contatos');
                        } else  {
                            banco_dados.create(req.body.usuario).then(function(novo_usuario) {
                                req.session.usuario = novo_usuario;
                                res.redirect('/contatos');
                              })
                              .catch(function(erro) {
                                res.redirect('/');  
                         });
                        }
                    });
        },
        logout: function(req, res) {
            req.session.destroy();
            res.redirect('/');
        }
    };
    return HomeController;
};