//Important note: module.exports.csr in config/csrf.js must be false for the tests

var supertest = require('supertest');
var login = require('./login');


describe('PeptiderController', function() {
  describe('create()', function() {
    describe('Without credential', function() {
      it('Access to create without credential. Should return status 403', function (done) {
        supertest(sails.hooks.http.app)
          .post('/Peptide/create')
          .send({gene: 'genetest'})
          .expect(403, done);
      });
    });

    describe('with credential. Should find 1 genetest gene', function() {
      var cookie;
      before(function(done){
        login.login(function(loginCookie){
          cookie = loginCookie;
          done();
        });
      });
      it('Create a peptide genetest', function (done) {
        supertest(sails.hooks.http.app)
          .post('/Peptide/create')
          .set('Cookie', cookie)
          .send({gene: 'genetest'})
          .expect('location', '/Peptide/adminlist', function () {
            Peptide.find({gene: 'genetest'})
              .then(function (peptidelist) {
                if (peptidelist.length !== 1) {
                  return done(new Error(
                    'There should be 1 peptide with the updated name for the test. There is actually: ' + peptidelist.length + " of them."
                  ));
                }
                return done();
              })
              .catch(done);
          });
      });

      after(function(){
        Peptide.destroy({gene:'genetest'}).exec(function (){
          return false;
        });
      });
    });
  });

  describe('list()', function() {
    it('Access to list page', function (done) {
      supertest(sails.hooks.http.app)
        .get('/Peptide/list')
        .expect('Content-Type','text/html; charset=utf-8', done);
    });
  });

  describe('search()', function() {
    it('Access to search page', function (done) {
      supertest(sails.hooks.http.app)
        .get('/Peptide/search')
        .expect('Content-Type','text/html; charset=utf-8', done);
    });
  });

  describe('adminlist()', function() {
    describe('Without credential', function() {
      it('Access to adminlist without credential. Should return status 403', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/adminlist')
          .expect(403, done);
      });
    });

    describe('With credential', function() {
      var cookie;
      before(function(done){
        login.login(function(loginCookie){
          cookie = loginCookie;
          done();
        });
      });

      it('Access to adminlist with credential. Should return the page', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/adminlist')
          .set('Cookie',cookie)
          .expect(200, done);

      });

    });
  });


  describe('add()', function() {
    describe('Without credential', function() {
      it('Access to add without credential. Should return status 403', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/add')
          .expect(403, done);
      });
    });

    describe('With credential', function() {
      var cookie;
      before(function(done){
        login.login(function(loginCookie){
          cookie = loginCookie;
          done();
        });
      });

      it('Access to add with credential. Should return the page', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/add')
          .set('Cookie',cookie)
          .expect(200, done);
      });

    });
  });


  describe('edit()', function() {
    describe('Without credential', function() {
      it('Access to edit without credential. Should return status 403', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/edit')
          .expect(403, done);
      });
    });

    describe('With credential', function() {
      var cookie;
      before(function(done){
          Peptide.create({_id:1, gene:"genetestedit", hla:"A2"}).exec(function (){
            login.login(function(loginCookie){
              cookie = loginCookie;
              done();
          });
        });
      });

      it('Access to edit with credential. Should return the page', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/edit/1')
          .set('Cookie',cookie)
          .expect(200, done);

      });

      after(function(){
        Peptide.destroy({gene:'genetestedit'}).exec(function (){
          return false;
        });
      });



    });
  });


  describe('update()', function() {
    describe('Without credential', function() {
      it('Access to update without credential. Should return status 403', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/update')
          .expect(403, done);
      });
    });

    describe('With credential', function() {
      var cookie;
      before(function(done){
        Peptide.create({_id:1, gene:"genetestedit", hla:"A2"}).exec(function (){
          login.login(function(loginCookie){
            cookie = loginCookie;
            done();
          });
        });
      });

      it('Access to update with credential. Should find a gene with the updated name', function (done) {
        supertest(sails.hooks.http.app)
          .post('/Peptide/update/1')
          .set('Cookie', cookie)
          .send({gene: 'genetestedit2'})
          .expect('location', '/Peptide/adminlist', function () {
            Peptide.find({gene: 'genetestedit2'})
              .then(function (peptidelist) {
                if (peptidelist.length !== 1) {
                  return done(new Error(
                    'There should be 1 peptide with the updated name for the test. There is actually: ' + peptidelist.length + " of them."
                  ));
                }
                return done();
              })
              .catch(done);
          });
        });

      after(function(){
        Peptide.destroy({gene:'genetestedit2'}).exec(function (){
          return false;
        });
      });

    });
  });


  describe('delete()', function() {
    describe('Without credential', function() {
      it('Access to delete without credential. Should return status 403', function (done) {
        supertest(sails.hooks.http.app)
          .get('/Peptide/delete')
          .expect(403, done);
      });
    });

    describe('With credential', function() {
      var cookie;
      before(function(done){
        Peptide.create({_id:1, gene:"genetestedit", hla:"A2"}).exec(function (){
          login.login(function(loginCookie){
            cookie = loginCookie;
            done();
          });
        });
      });

      it('Access to delete with credential. There should not be any genetestedit item left in the database after the instruction', function (done) {
        supertest(sails.hooks.http.app)
          .post('/Peptide/delete/1')
          .set('Cookie', cookie)
          .expect('location', '/Peptide/adminlist', function () {
            Peptide.find({gene: 'genetestedit'})
              .then(function (peptidelist) {
                if (peptidelist.length !== 0) {
                  return done(new Error(
                    'There should be 0 peptide. There still is 1 of it.'
                  ));
                }
                return done();
              })
              .catch(done);
          });
      });
    });
  });
});
