var supertest = require('supertest');
var account = { email: 'admin@caped.com', password: 'test' };
var loginCookie;

exports.login = function (done) {
  supertest(sails.hooks.http.app)
    .post('/login')
    .send(account)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      loginCookie = res.headers['set-cookie'];
      done(loginCookie);
    });
};
