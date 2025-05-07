module.exports = function (app) {
  const usuarios = app.models.usuario;
  var contatoController = {
    index: function (req, res) {
      var _id = req.session.usuario._id;
      usuarios.findById(_id).then(function (usuario) {
        var contatos = usuario.contatos;
        var resultado = { contatos: contatos };
        res.render('contatos/index', resultado);
      });
    },
    create: function (req, res) {
      var _id = req.session.usuario._id;
      usuarios.findById(_id, function (erro, usuario) {
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
      usuarios.findById(_id, function (erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        var resultado = { contato: contato };
        res.render('contatos/edit', resultado);
      });
    },
    edit: function (req, res) {
      var _id = req.session.usuario._id;
      usuarios.findById(_id, function (erro, usuario) {
        var contatoID = req.params.id;
        var contato = usuario.contatos.id(contatoID);
        var resultado = { contato: contato };
        res.render('contatos/edit', resultado);
      });
    },
    update: function (req, res) {
      var _id = req.session.usuario._id;
      usuarios.findById(_id, function (erro, usuario) {
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
      usuarios.findById(_id, function (erro, usuario) {
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
