/**
 * res.login([inputs])
 *
 * @param {String} inputs.username
 * @param {String} inputs.password
 *
 * @description :: Log the requesting user in using a passport strategy
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = function login(inputs) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  const bcrypt = require('bcrypt');

  // Look up the user
  User.findOne({
    email: inputs.email
  }).exec(function (err, user) {
    if (err)
      return res.negotiate(err);

    // Redirect to the login page if there wasn't any user matching the email
    if (!user) {
      return res.view('login',{error:"error"});
    }

    //Use bcrypt to compare the password if there was a user found.
    bcrypt.compare(inputs.password, user.password, function(err, isMatch) {
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
};

