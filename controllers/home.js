module.exports = function(app) {
    var usuario =app.models.usuario;
    var HomeController = {
        index: function(req, res) {
            res.render ('home/index');
        },
        login: function(req, res) {
            var query = {email: req.body.usuario.email};
            console.log(query)
            usuario.findOne(query)
                 .select('email')
                 .exec(function(erro, usuario){                     
                     if(usuario) {
                         req.session.usuario = usuario;
                         res.redirect('/contatos');
                        } else  {
                         usuario.create(req.body.usuario, function(erro, usuario) {
                            if(erro){
                                res.redirect('/');
                            } else {
                                req.session.usuario = usuario;
                                res.redirect('/contatos');
                            }                          
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