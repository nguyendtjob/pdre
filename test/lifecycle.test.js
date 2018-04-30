var sails = require('sails');

//Important note: module.exports.csr in config/csrf.js must be false for the tests
// Before running any tests...
before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout(5000);

  sails.lift({
    // Your sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    // For example, we might want to skip the Grunt hook,
    // and disable all logs except errors and warnings:
    hooks: { grunt: false },
    log: { level: 'warn' }

  }, function(err) {
    if (err) { return done(err); }

    // here you can load fixtures, etc.
    // (for example, you might want to create some records in the database)

    User.destroy().then(function(){
      User.create({
        email: "admin@caped.com",
        password: "$2a$10$2g84fhGpD4A6hPggG7t9qu8PklKS7xAarfOOHPN3M8xslicXYPYdu"
      }).then(function(){
        return done();
      });
    });

    });
});

// After all tests have finished...
after(function(done) {

  // here you can clear fixtures, etc.
  // (e.g. you might want to destroy the records you created above)

  sails.lower(done);

});
