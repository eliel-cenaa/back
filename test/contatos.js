var app = require('../app')
 , request = require('supertest') (app);

 describe('no controller contatos', function () {

    describe('o usuario nao logado', function() {
        it('deve ir para / ao fazer GET /contatos',function(done){
            request.get('/contatos').end(function(err, res) {
                res.headers.location.should.eql('/');
                done();
            });
        });
        it('deve ir para / ao fazer GET /contato/1', function(done){
            request.get('/contato/1').end(function(err, res){
                res.headers.location.should.eql('/');
                done();
            });
        });
        it('deve ir para / ao fazer GET /contato/1/editar', function(done){
            request.get('/contato/1/editar').end(function(err, res){
                res.headers.location.should.eql('/');
            });
        });
        it('deve ir para / ao fazer POST /contato', function(done){
            request.post('/contato').end(function(err, res){
                res.headers.location.should.eql('/');
                done();
            });
        });
        it('deve ir para / ao fazer DELETE /contato/1', function(done){
            request.del('/contato/1').end(function(err, res) {
                res.headers.location.should.eql('/');
                done();
            });
        });
        it('deve ir para / ao fazer PUT /contato/1', function(done){
            request.put('/contato/1').end(function(err, res){
                res.headers.location.should.eql('/');
                done();
            });
        });

    });
    describe('o usuario logado', function() {
        var login = {usuario: {nome: 'teste', email: 'teste@teste'}}
         ,contato = {contato: {nome: 'teste', email: 'teste@teste'}}
         , cookie = {};

         beforeEach(function(done) {
            request.post('/entrar')
                   .send(login)
                   .end(function(err, res) {
            cookie = res.headers['set-cookie'];
            done();        
            });
         });
         it('deve retornar status 200 em GET /contatos', function(done){
            var req = request.get('/contatos');
            req.cookies = cookie;
            req.end(function(err, res) {
                res.status.should.eql(200);
                done();
            });
         });
         it('deve ir para rota /contatos em POST /contato', function(done){
            var contato = {contato: {nome: 'teste', email: 'teste@teste'}};
            var req = request.post('/contato');
            req.cookies = cookie;
            req.send(contato).end(function(err, res) {
                res.headers.location.should.eql('/contatos');
                done();
            });
         });
    });
 });