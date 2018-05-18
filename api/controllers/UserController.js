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
    var bcrypt = require('bcrypt');

    // Look up the user
    User.findOne({
      email: req.body.email
    }).exec(function (err, user) {
      if (err)
        return res.negotiate(err);

      // Redirect to the login page if there wasn't any user matching the email
      if (!user) {
        return res.view('login',{error:"error"});
      }

      //Use bcrypt to compare the password if there was a user found.
      bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if (err)
          return res.negotiate(err);

        if(isMatch) {
          req.session.me = user.id;
          return res.redirect('/Peptide/adminlist');
        } else {
          return res.view('login',{error:"error"});
        }
      });
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    req.session.destroy(function(err){
      if (err)
        return res.negotiate(err);

      return res.redirect('/Peptide/list');

    })
  }


};
