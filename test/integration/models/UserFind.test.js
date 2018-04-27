describe('User', function() {
  describe('find()', function() {
    it('should return 1 user', function (done) {
      User.find()
        .then(function(userlist) {
          if (userlist.length !== 1) {
            return done(new Error(
              'There should be only 1 user for the test. There is actually: ' + userlist.length + " of them."
            ));
          }
          return done();
        })
        .catch(done);
    });
  });
});
