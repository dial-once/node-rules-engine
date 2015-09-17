var rEngine = require('../');

function doneCallback(done){
  return function(){
    done();
  }
}

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
      .catch(doneCallback(done));
  });

  it('should trigger an exception when called with bad params', function(done) {
    rEngine.apply({}, {})
      .then(function(){
        done(new Error('It should have failed'));
      })
      .catch(doneCallback(done));
  });

  it('should trigger an exception when called with invalid events but valid specs format', function(done) {
    rEngine.apply({}, [])
      .then(function(){
        done(new Error('It should have failed'));
      })
      .catch(doneCallback(done));
  });

  it('should trigger an exception when called with valid events but invalid specs format', function(done) {
    rEngine.apply([], {})
      .then(function(){
        done(new Error('It should have failed'));
      })
      .catch(doneCallback(done));
  });
});

describe('rule engine usage', function() {

  it('should get false when event list is empty (default is no-match)', function(done) {
    rEngine.apply([], [])
      .then(function(res){
        expect(res).not.toBe(true);
        done();
      });
  });

  it('should match a simple equal rule', function(done) {
    rEngine.apply([{'view': { val: 0 }}], [{'view': {val: 0, should: true}}])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should reject a simple equal rule', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: 0, should: true}}])
      .then(function(res){
        expect(res).not.toBe(true);
        done();
      });
  });

  it('should match when found on OR clause', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: [0, 1, 2], should: true}}])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should reject when not found on OR clause', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: [0, 2, 3], should: true}}])
      .then(function(res){
        expect(res).not.toBe(true);
        done();
      });
  });

  it('should match ANY rule when key is found', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: '*', should: true}}])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should not match ANY rule when key is not found', function(done) {
    rEngine.apply([{'click': { val: 1 }}], [{'view': {val: '*', should: true}}])
      .then(function(res){
        expect(res).not.toBe(true);
        done();
      });
  });

  it('should not match when found on OR clause but should not', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: [0, 1, 2], should: false}}])
      .then(function(res){
        expect(res).not.toBe(true);
        done();
      });
  });

  it('should match when not found on OR clause but should not', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: [0, 2, 3], should: false}}])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should not match ANY rule when key is found but should not', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: '*', should: false}}])
      .then(function(res){
        expect(res).not.toBe(true);
        done();
      });
  });

  it('should match ANY rule when key is not found but should not', function(done) {
    rEngine.apply([{'click': { val: 1 }}], [{'view': {val: '*', should: false}}])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should match when found in an array of conditions', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{'view': {val: '*', should: true}},{'view': {val: '*', should: true}}])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should match when an array of event match a condition', function(done) {
    rEngine.apply([{'view': { val: 1 }}, {'view': { val: 1 }}], [{'view': {val: 1, should: true}}])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });
});

describe('rule engine complex usage', function(){
  var usage = [
    {'view': {val: 1}},
    {'view': {val: 2}},
    {'view': {val: 3}},
    {'click': {val: true}},
    {'random': {val: 30}}
  ];

  it('should match with many event matching many rules (even count)', function(done){
    rEngine.apply(usage, [
      {'view': {val: 1, should: true}},
      {'view': {val: 2, should: true}},
      {'view': {val: 3, should: true}},
      {'click': {val: true, should: true}},
      {'random': {val: 30, should: true}}
    ])
    .then(function(res){
      expect(res).toBe(true);
      done();
    });
  });

  it('should match with many event matching many rules (uneven count)', function(done){
    rEngine.apply(usage, [
      {'view': {val: 1, should: true}},
      {'view': {val: 2, should: true}},
      {'view': {val: 3, should: true}},
      {'click': {val: true, should: true}}
    ])
    .then(function(res){
      expect(res).toBe(true);
      done();
    });
  });

  it('should not match when one of the many event don\'t match many rules', function(done){
    rEngine.apply(usage, [
      {'view': {val: 1, should: true}},
      {'view': {val: 2, should: true}},
      {'view': {val: 4, should: true}},
      {'click': {val: true, should: true}},
      {'random': {val: 30, should: true}}
    ])
    .then(function(res){
      expect(res).not.toBe(true);
      done();
    });
  });

  it('should not match when one of the many event don\'t match one of the rules', function(done){
    rEngine.apply(usage, [
      {'view': {val: 1, should: true}},
      {'view': {val: 2, should: true}},
      {'view': {val: 3, should: false}},
      {'click': {val: true, should: true}},
      {'random': {val: 30, should: true}}
    ])
    .then(function(res){
      expect(res).not.toBe(true);
      done();
    });
  });

  it('should match when events match specifications (using array of values)', function(done){
    rEngine.apply(usage, [
      {'view': {val: [1,2,3], should: true}},
      {'click': {val: true, should: true}},
      {'random': {val: 30, should: true}}
    ])
    .then(function(res){
      expect(res).toBe(true);
      done();
    });
  });

  it('should match when events match specifications (using wildcard)', function(done){
    rEngine.apply(usage, [
      {'view': {val: '*', should: true}},
      {'click': {val: true, should: true}},
      {'random': {val: 30, should: true}}
    ])
    .then(function(res){
      expect(res).toBe(true);
      done();
    });
  });
});