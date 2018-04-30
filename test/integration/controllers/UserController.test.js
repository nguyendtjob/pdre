//Important note: module.exports.csr in config/csrf.js must be false for the tests

var supertest = require('supertest');
var login = require('./login');

describe('UserController', function() {

  describe('login()', function() {
    it('Access to the login form page', function (done) {
      supertest(sails.hooks.http.app)
        .get('/login')
        .expect(200)
        .expect('Content-Type','text/html; charset=utf-8', done);
    });

    it('Correct credentials. should redirect to adminlist', function (done) {
      supertest(sails.hooks.http.app)
        .post('/login')
        .send({ email: 'admin@caped.com', password: 'test' })
        .expect(302)
        .expect('location','/Peptide/adminlist', done);
    });

    it('Correct email, but wrong password. should redirect to login (hmtl response, not a redirect)', function (done) {
      supertest(sails.hooks.http.app)
        .post('/login')
        .send({ email: 'admin@caped.com', password: 'wrongpassword' })
        .expect(200)
        .expect('Content-Type','text/html; charset=utf-8', done);
    });

    it('Wrong email, but correct password. should redirect to login (hmtl response, not a redirect)', function (done) {
      supertest(sails.hooks.http.app)
        .post('/login')
        .send({ email: 'wrong@site.com', password: 'test' })
        .expect(200)
        .expect('Content-Type','text/html; charset=utf-8', done);
    });

    it('Wrong email and wrong password. should redirect to login (hmtl response, not a redirect)', function (done) {
      supertest(sails.hooks.http.app)
        .post('/login')
        .send({ email: 'wrong@site.com', password: 'wrongpassword' })
        .expect(200)
        .expect('Content-Type','text/html; charset=utf-8', done);
    });
  });


  describe('logout()', function() {
    var cookie;
    before(function(done){
      login.login(function(loginCookie){
        cookie = loginCookie;
        done();
      });
    });

    it('should redirect to general list', function (done) {
      supertest(sails.hooks.http.app)
        .post('/User/logout')
        .set('Cookie',cookie)
        .expect(302)
        .expect('location','/Peptide/list', done);
    });
  });
});
