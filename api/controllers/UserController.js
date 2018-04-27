/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `UserController.loginform()`
   */
  login: function (req, res) {
    res.view('login',{error:null});
  },

  /**
   * `UserController.login()`
   */
  loginaction: function (req, res) {
    // See `api/responses/login.js`
    return res.login({
      email: req.param('email'),
      password: req.param('password')
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    // "Forget" the user from the session.
    // Subsequent requests from this user agent won't have `req.session.me`.
    req.session.me = null;

    return res.redirect('/Peptide/list');
  }


};
