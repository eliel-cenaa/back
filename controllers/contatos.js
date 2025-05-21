module.exports = function (app) {
  const banco_dados = app.models.usuario;
  var contatoController = {
    index: function (req, res) {
      var id = req.session.usuario._id;
      banco_dados.findById(id).then(function (usuario) {
        var contatos = usuario.contatos;
        var resultado = { contatos: contatos };
        res.render('contatos/index', resultado);
      });
    },
    create: function (req, res) {
      var id = req.session.usuario._id;
      banco_dados.findById(id).then( function (erro, usuario) {
        var contato = req.body.contato;
        var contato = usuario.contatos;
        contatos.push(contato);
        usuario.save(function () {
          res.redirect('/contatos');
        });
      });
    },
    show: function (req, res) {
      var _id = req.session.usuario._id;
      banco_dados.findById(id).then( function (erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        var resultado = { contato: contato };
        res.render('contatos/edit', resultado);
      });
    },
    edit: function (req, res) {
      var _id = req.session.usuario._id;
      banco_dados.findById(id).then( function (erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        var resultado = { contato: contato };
        res.render('contatos/edit', resultado);
      });
    },
    update: function (req, res) {
      var _id = req.session.usuario._id;
      banco_dados.findById(id).then( function (erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        contato.nome = req.body.contato.nome;
        contato.email = req.bory.contato.email;
        usuario.save(function () {
          res.redirect('/contatos');
        });
      });
    },
    destroy: function (req, res) {
      var _id = req.session.usuario._id;
      banco_dados.findById(id).then( function (erro, usuario) {
        var contatoID = req.params.id;
        usuario.contatos.id(contatoID).remove();
        usuario.save(function () {
          res.redirect('/contatos');
        });
      });
    },
  };
  return contatoController;
};
