var Promise = require('bluebird');
var _ = require('lodash');

var rulesEngine = {};

function checkParameters(events, specs) {
  return new Promise(function(resolve, reject){
    if (typeof events !== 'object' || typeof specs !== 'object') {
      reject(new Error('Invalid parameters'));
    } else if (specs && specs.length === undefined) {
      reject(new Error('Invalid specifications'));
    } else if (events && events.length === undefined) {
      reject(new Error('Not events provided'));
    }
    resolve({events: events, specs: specs});
  });
}

function checkRule(ev, specs) {
  _.each(ev, function(event, evk){
    _.each(specs, function(spec){
      _.each(spec, function(sp, spk){
        if (sp.matched !== undefined) return;

        if (evk === spk) {
          if (typeof sp.val === 'object') {
            sp.matched = (_.includes(sp.val, event.val) === sp.should);
          } else if (sp.val === '*'){
            sp.matched = sp.should;
          } else if ((event.val === sp.val) === sp.should) {
            sp.matched = true;
          }
        }
      });
    });
  });
}

function checkRules(params) {
  if (params.events.length === 0 || params.specs.length === 0) {
    return false;
  }

  var result = true;

  _.each(params.events, function(event){
    checkRule(event, params.specs);
  });

  _.each(params.specs, function(spec){
    _.each(spec, function(sp) {
      if (sp.matched === undefined) sp.matched = (sp.should === false);
      result = result && (sp.matched || false);
    });
  });

  return result;
}

rulesEngine.apply = function(events, specs) {
  return checkParameters(events, specs)
    .then(checkRules);
};

module.exports = rulesEngine;