var Promise = require('bluebird');
//var _ = require('lodash');

var rulesEngine = {};

function checkParameters(events, specs) {
  return new Promise(function(resolve, reject){
    if (typeof events !== 'object' || typeof specs !== 'object') {
      reject(new Error('Invalid parameters'));
    } else {
      resolve();
    }
  });
}

rulesEngine.apply = function(events, specs) {
  return checkParameters(events, specs)
  .then(function(){
    return true;
  });
};

module.exports = rulesEngine;