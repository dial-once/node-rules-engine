var rEngine = require('../');

describe('complex rule', function(){

  it('should throw an error for not-implemented rules', function(done){
    rEngine.apply([{'clicks': {val: 10}}], [{'clicks': {val: {$thing: 20}, should: false}}])
      .then(function(){
        done(new Error('Should not pass through here...'));
      })
      .catch(function(){
        done();
      });
  });

  describe('greater than', function(){
    it('should return true when using $gt and value is actually realy $gt', function(done){
      rEngine.apply([{'clicks': {val: 10}}], [{'clicks': {val: {$gt: 0}, should: true}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });

    it('should return false when using $gt and value is actually not $gt', function(done){
      rEngine.apply([{'clicks': {val: 10}}], [{'clicks': {val: {$gt: 20}, should: true}}])
        .then(function(res){
          expect(res).not.toBe(true);
          done();
        });
    });

    it('should return false when using $gt and value is actually realy $gt, but should not', function(done){
      rEngine.apply([{'clicks': {val: 10}}], [{'clicks': {val: {$gt: 0}, should: false}}])
        .then(function(res){
          expect(res).not.toBe(true);
          done();
        });
    });

    it('should return true when using $gt and value is not $gt, but should not', function(done){
      rEngine.apply([{'clicks': {val: 10}}], [{'clicks': {val: {$gt: 20}, should: false}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });
  });

  describe('greater than or equal', function(){
    it('should return true when using $gte and value IS $eq', function(done){
      rEngine.apply([{'clicks': {val: 10}}], [{'clicks': {val: {$gte: 10}, should: true}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });

    it('should return true when using $gte and value IS $gt', function(done){
      rEngine.apply([{'clicks': {val: 12}}], [{'clicks': {val: {$gte: 10}, should: true}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });

    it('should return false when using $gte and value is NOT $gte', function(done){
      rEngine.apply([{'clicks': {val: 1}}], [{'clicks': {val: {$gte: 10}, should: true}}])
        .then(function(res){
          expect(res).not.toBe(true);
          done();
        });
    });
  });

  describe('lesser than', function(){
    it('should return true when using $lt and value is actually realy $lt', function(done){
      rEngine.apply([{'clicks': {val: 0}}], [{'clicks': {val: {$lt: 10}, should: true}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });

    it('should return false when using $lt and value is actually not $lt', function(done){
      rEngine.apply([{'clicks': {val: 20}}], [{'clicks': {val: {$lt: 10}, should: true}}])
        .then(function(res){
          expect(res).not.toBe(true);
          done();
        });
    });

    it('should return false when using $lt and value is actually realy $lt, but should not', function(done){
      rEngine.apply([{'clicks': {val: 0}}], [{'clicks': {val: {$lt: 10}, should: false}}])
        .then(function(res){
          expect(res).not.toBe(true);
          done();
        });
    });

    it('should return true when using $lt and value is not $lt, but should not', function(done){
      rEngine.apply([{'clicks': {val: 20}}], [{'clicks': {val: {$lt: 10}, should: false}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });
  });

  describe('lesser than or equal', function(){
    it('should return true when using $lte and value IS $eq', function(done){
      rEngine.apply([{'clicks': {val: 10}}], [{'clicks': {val: {$lte: 10}, should: true}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });

    it('should return true when using $lte and value IS $lt', function(done){
      rEngine.apply([{'clicks': {val: 5}}], [{'clicks': {val: {$lte: 10}, should: true}}])
        .then(function(res){
          expect(res).toBe(true);
          done();
        });
    });

    it('should return false when using $lte and value is NOT $lte', function(done){
      rEngine.apply([{'clicks': {val: 51}}], [{'clicks': {val: {$lte: 10}, should: true}}])
        .then(function(res){
          expect(res).not.toBe(true);
          done();
        });
    });
  });
});