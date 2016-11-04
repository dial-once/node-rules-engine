var rEngine = require('../');

describe('rule engine usage', function() {
  it('should match when one of the OR properties is matched', function(done) {
    rEngine.apply([{'view': { val: 0 }}], [{ 'view': { val: 0, should: true, optional: true }}, { 'view': { val: 1, should: true, optional: true } }])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should match when all the OR properties are matched', function(done) {
    rEngine.apply([{'view': { val: 1 }}], [{ 'view': {val: { $gt: 0 }, should: true, optional: true }}, { 'view': { val: 1, should: true, optional: true } }])
      .then(function(res){
        expect(res).toBe(true);
        done();
      });
  });

  it('should not match when all OR conditions are not met (required condition met)', function(done) {
    rEngine.apply([{'view': { val: 0 }}], [{ 'view': { val: 0, should: true }}, { 'view': { val: 1, should: true, optional: true } }])
      .then(function(res){
        expect(res).toBe(false);
        done();
      });
  });

  it('should not match when all OR conditions are not met (only OR)', function(done) {
    rEngine.apply([{'view': { val: 2 }}], [{ 'view': { val: 0, should: true, optional: true }}, { 'view': { val: 1, should: true, optional: true } }])
      .then(function(res){
        expect(res).toBe(false);
        done();
      });
  });
});