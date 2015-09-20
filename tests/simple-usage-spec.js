var rEngine = require('../');

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