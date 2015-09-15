var rEngine = require('../');

describe('rule engine entry point', function() {
  it('should be an object', function() {
    expect(typeof rEngine).toBe('object');
  });

  it('should have apply function defined', function() {
    expect(typeof rEngine.apply).toBe('function');
  });

  it('should trigger an exception when called with no params', function(done) {
    rEngine.apply()
    .then(function(){
      done(new Error('It should have failed'));
    })
    .catch(function(){
      done();
    });
  });

  it('should trigger an exception when called with bad params', function(done) {
    rEngine.apply({}, {})
    .then(function(){
      done(new Error('It should have failed'));
    })
    .catch(function(){
      done();
    });
  });

  it('should trigger an exception when called with invalid events but valid specs format', function(done) {
    rEngine.apply({}, [])
    .then(function(){
      done(new Error('It should have failed'));
    })
    .catch(function(){
      done();
    });
  });

  it('should trigger an exception when called with valid events but invalid specs format', function(done) {
    rEngine.apply([], {})
    .then(function(){
      done(new Error('It should have failed'));
    })
    .catch(function(){
      done();
    });
  });

  it('should get true when params are valid but empty', function(done) {
    rEngine.apply([], [])
    .then(function(){
      done();
    });
  });
});