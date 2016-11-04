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

  it('should match not match contrary events (should NOT be 1 but should be anything)', function(done){
    rEngine.apply(usage, [
      {'view': {val: 1, should: false}},
      {'view': {val: '*', should: true}}
    ])
    .then(function(res){
      expect(res).toBe(false);
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

  it('should match when events match specifications (using array of values)', function(done){
    rEngine.apply(usage, [
      {'view': {val: [1,2,3], should: true}},
      {'view': {val: [4,5,6], should: false}},
      {'click': {val: true, should: true}},
      {'random': {val: 30, should: true}}
    ])
    .then(function(res){
      expect(res).toBe(true);
      done();
    });
  });

  it('should match when events match specifications (using array of values)', function(done){
    rEngine.apply(usage, [
      {'view': {val: [1,2,3], should: false}},
      {'click': {val: true, should: true}},
      {'random': {val: 30, should: true}}
    ])
    .then(function(res){
      expect(res).toBe(false);
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

  it('should not match a complex rule based on string arrays', function(done) {
    rEngine.apply([ { vibrate: { val: undefined } },
      { view: { val: '577a347b-de60-469a-a0aa-ff8ae4787b5f' } },
      { openView: { val: '4c75e2de-0c03-43ba-a7c1-03cf9085fd0a' } },
      { openView: { val: '577a347b-de60-469a-a0aa-ff8ae4787b5f' } },
      { openView: { val: 'f5563525-3926-46a3-9aee-7932c6297206' } },
      { openView: { val: '13bd1219-8d68-4756-ac45-49624d3f68c3' } },
      { '@count': { val: 6 } },
      { '@viewCount': { val: 1 } } ], [
      {
       "openView": {
         "val": [
           "38705acb-b230-4596-9648-9a8076cc583c",
           "56069913-656a-4861-9e84-0b1371cc8170",
           "163b7b6b-aa77-4f4c-870d-ecedd25d3421",
           "fa8945b5-7813-49bd-b8c3-68245dc7fac4",
           "13bd1219-8d68-4756-ac45-49624d3f68c3"
         ],
         "should": false
       }
      },
      {
       "openView": {
         "val": [
           "f5563525-3926-46a3-9aee-7932c6297206",
           "4b5830f9-0c10-4f6e-ae45-5aff67eedeb9",
           "7990ce91-182e-40be-9d7b-f28eaf766b9b",
           "1b28a8aa-5377-4b77-af08-28c2556a27b3",
           "c0b1d703-5077-424f-b577-c3a2d0d0740a"
         ],
         "should": true
       }
      }
    ]).then(function(res) {
      expect(res).toBe(false);
      done();
    });
  });

  it('should match rules', function(done) {
    rEngine.apply([ { view: { val: '577a347b-de60-469a-a0aa-ff8ae4787b5f' } },
      { openView: { val: 'f5563525-3926-46a3-9aee-7932c6297206' } },
      { openView: { val: '13bd1219-8d68-4756-ac45-49624d3f68c3' } },
      { openView: { val: '4c75e2de-0c03-43ba-a7c1-03cf9085fd0a' } },
      { openView: { val: '577a347b-de60-469a-a0aa-ff8ae4787b5f' } },
      { '@count': { val: 5 } },
      { '@viewCount': { val: 1 } },
      { '@openViewCount': { val: 4 } } ],
      [{
        "openView" : {
          "val" : [
            "fa8945b5-7813-49bd-b8c3-68245dc7fac4",
            "13bd1219-8d68-4756-ac45-49624d3f68c3"
          ],
          "should" : true
        }
      }]).then(function(res) {
        expect(res).toBe(true);
        done();
      });
  });
});
