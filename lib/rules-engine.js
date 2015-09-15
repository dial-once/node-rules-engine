var Promise = require('bluebird');
//var _ = require('lodash');

var rulesEngine = {};

function checkParameters(events, specs) {
  return new Promise(function(resolve, reject){
    if (typeof events !== 'object' || typeof specs !== 'object') {
      return reject(new Error('Invalid parameters'));
    } else if (specs && specs.length === undefined) {
      return reject(new Error('Invalid specifications'));
    } else if (events && events.length === undefined) {
      return reject(new Error('Not events provided'));
    }
    resolve();
  });
}

rulesEngine.apply = function(events, specs) {
  return checkParameters(events, specs)
  .then(function(){
    return true;
  });
};

module.exports = rulesEngine;