var Promise = require('bluebird');
var _ = require('lodash');

var rulesEngine = {};

/**
 * @param  {Array} Array of events
 * @param  {Array} Array of specs
 * @return {Promise} A regular promise
 *
 * This method checks if parameters sent to the module are valid
 */
function checkParameters(events, specs) {
  return new Promise(function(resolve, reject){
    //both params should be objects (it should be arrays)
    if (typeof events !== 'object' || typeof specs !== 'object') {
      reject(new Error('Invalid parameters'));
    } else if (specs && specs.length === undefined) { //here we check if it is arrays using .length === undefined.. 
                                                      //there should be a better way
      reject(new Error('Invalid specifications'));
    } else if (events && events.length === undefined) {
      reject(new Error('Not events provided'));
    }
    //resolve promise and pass the object to the next method in the chain (can't pass multiple parameters...)
    resolve({events: events, specs: specs});
  });
}

/**
 * ruleComputer is an object of various methods ($gt, $lt, etc.)
 * @type {Object}
 */
var ruleComputer = {
  //greater than
  '$gt': function(val1, val2) {
    return val2 > val1;
  },
  '$gte': function(val1, val2) {
    return val2 >= val1;
  },
  //lesser than
  '$lt': function(val1, val2) {
    return val2 < val1;
  },
  '$lte': function(val1, val2) {
    return val2 <= val1;
  },
  //default for non-implemented methods
  '$default': function(){
    throw 'Not implemented yet';
  }
};

/**
 * @param  {object} the rule object, exemple: {$gt: 0}
 * @param  {var} the value to check against
 * @return {boolean} the result of the computed rule
 */
function checkComputedRule(rule, val) {
  var key = Object.keys(rule)[0];
  var fct = ruleComputer[key] || ruleComputer.$default;
  return fct(rule[key], val);
}

/**
 * @param  {object} The current event to be checked against Specs
 * @param  {Array} The specification array to check the event against
 * @return {void} The method returns nothing, result is aggregated into specs parameters
 * (we want to keep spec context between the various calls)
 */
function checkRule(ev, specs) {
  _.each(ev, function(event, evk){ //for each key in the event (ie. 'views') there is usualy 1 but there can be more
    _.each(specs, function(spec){ //for each specs
      _.each(spec, function(sp, spk){ //for each key in spec (ie. 'views') there is usualy 1 but there can be more
        if (sp.matched !== undefined) { //if rule has already been evaluated, don't evaluate again!
          return; 
        }
        if (evk === spk) { //if the key if the event is the key of the spec ('views' === 'views')
          if (typeof sp.val === 'object') { //if the specifications value is an array ('Contains' clause)
            if (sp.val.length === undefined) {
              sp.matched = checkComputedRule(sp.val, event.val) === sp.should;
            } else {
              sp.matched = (_.includes(sp.val, event.val) === sp.should) || (sp.should?undefined:false); //or clause get undefined if not found
            }
          } else if (sp.val === '*'){ //if the spec should match any value
            sp.matched = sp.should;
          } else if ((event.val === sp.val) === sp.should) { //if the spec is made on a regular value
            sp.matched = sp.should;
          }
        }
      });
    });
  });
}

/**
 * @param  {object} - The events AND specifications passed by the previous method in the promise pipeline
 * @return {Boolean} - Are the events matching the specs?
 */
function checkRules(params) {
  //if there is no spec or no event, it's not a match
  if (params.events.length === 0 || params.specs.length === 0) {
    return false;
  }

  //default result is true
  var result = true;

  //check each event against rules
  _.each(params.events, function(event){
    checkRule(event, params.specs);
  });

  //now iterate through every specs to check if they are evaluated and if they are all true
  _.each(params.specs, function(spec) {
    _.each(spec, function(sp) {
      if (sp.matched === undefined) { //if not evaluated, value is should === false
        sp.matched = (sp.should === false); 
      }
      result = result && (sp.matched || false); //everything should be true!
    });
  });

  return result;
}

/**
 * @param  {Array} Event list, see format below
 * @param  {Array} Specification list, see format below
 * @return {Promise} A regular promise, use .then or .catch to handle result
 *
 * Parameters:
 *  - Events: a list of events constructed as
 *    [{'click': { val: 1 }}] - this represent a one-event sequence to check, event is named click and have a value of 1
 *    [{'click': { val: 1 }}, {'click': {val: 2}}] - this is a two-event sequence to check, events are both clicks and values are 1 and 2
 *  - Specs: a list of specifications to compare with event sequence
 *    [{'click': {val: 1, should: true}}] - this is a one-rule specification, rule will be checked against 'click' events, and a click event with val 1 should be found
 *
 * Etc.
 */
rulesEngine.apply = function(events, specs) {
  //first check parameters then chain on the rules check
  return checkParameters(events, specs)
    .then(checkRules);
};

module.exports = rulesEngine;