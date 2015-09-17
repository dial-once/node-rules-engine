var rEngine = require('../');

describe('rule engine multiple usage', function(){
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

  it('should match when events match specifications (using array of values, not every event present)', function(done){
    rEngine.apply(usage, [
      {'view': {val: [1,2], should: true}},
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