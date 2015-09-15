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
    resolve({events: events, specs: specs});
  });
}

function checkRules(params) {
  if (params.events.length === 0 || params.specs.length === 0) {
    return false;
  }

  return false;
}

rulesEngine.apply = function(events, specs) {
  return checkParameters(events, specs)
  .then(checkRules);
};

module.exports = rulesEngine;