module.exports = function(app) {
    var usuarios = app.models.usuario;
    var HomeController = {
        index: function(req, res) {
            res.render ('home/index');
        },
        login: function(req, res) {
            var query = {email: req.body.usuario.email};
            usuarios.findOne(query).select('_id email').then(function(usuario){                     
                     if(usuario) {
                         req.session.usuario = usuario;
                         res.redirect('/contatos');
                        } else  {
                            usuarios.create(req.body.usuario).then(function(novo_usuario) {
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