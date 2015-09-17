# node-rules-engine
[![Dependency Status](https://david-dm.org/dial-once/node-rules-engine.svg)](https://david-dm.org/dial-once/node-rules-engine)
[![Codacy](https://img.shields.io/codacy/1f7212250ea849ccb49ca273a9b4290e.svg)](https://www.codacy.com/app/pukoren/node-rules-engine)
[![Codeship](https://img.shields.io/codeship/20e197d0-3f4d-0133-ca24-22e25667a15e.svg)](https://codeship.com/projects/103052)

A node.js module to check if an event array matches some specifications.
Usefull when you want to compare many rules with many events and check if the final output is true/false. 

Dial Once uses this module to easily check if a user match a goal/funnel using our interfaces. See exemple below for a more explanatory exemple.

# installation
```
npm install rules-engine
```
```js
var engine = require('rules-engine');
engine.apply(events, rules).then(function(result){
  console.log(result); //boolean, true if events are matching rules, false otherwise
});
```

# example
We want here to check if user viewed page 1, page 3, and then made a click (basic conversion test).
('page' and 'click' here are arbitrary and you can use whatever you want)
```js

var engine = require('rules-engine');

var events = [
  {'page': {val: 1}},
  {'page': {val: 3}},
  {'click': {val: true}}
];

var rules = [
  {'page': {val: 1, should: true}},
  {'page': {val: 3, should: true}},
  {'click': {val: true, should: true}}
];

engine.apply(events, rules).then(function(result){
  console.log(result); //true!
});
```

Then things can be a bit more complicated, if we want to check if user viewed page 1, 3 but did not make any click:
```js
var rules = [
  {'page': {val: 1, should: true}},
  {'page': {val: 3, should: true}},
  {'click': {val: true, should: false}}
];
engine.apply(events, rules).then(function(result){
  console.log(result); //false!
});
```

Some more cases can be handled, like 'user viewed either page 1, 2, or 3 and made a click:
```js
var rules = [
  {'page': {val: [1, 2, 3], should: true}},
  {'click': {val: true, should: true}}
];
```

User viewed any page:
```js
var rules = [
  {'page': {val: '*', should: true}}
];
```

User viewed any page BUT page 3:
```js
var rules = [
  {'page': {val: '*', should: true}},
  {'page': {val: 3, should: false}}
];
```

