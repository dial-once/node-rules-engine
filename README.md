# node-rules-engine
[![David](https://david-dm.org/dial-once/node-rules-engine.svg?style=flat-square)](https://david-dm.org/dial-once/node-rules-engine)
[![Codacy](https://img.shields.io/codacy/1f7212250ea849ccb49ca273a9b4290e.svg?style=flat-square)](https://www.codacy.com/app/pukoren/node-rules-engine)
[![Code Climate](https://img.shields.io/codeclimate/github/dial-once/node-rules-engine.svg?style=flat-square)](https://codeclimate.com/github/dial-once/node-rules-engine)
[![Code Climate](https://img.shields.io/codeclimate/coverage/github/dial-once/node-rules-engine.svg?style=flat-square)](https://codeclimate.com/github/dial-once/node-rules-engine)
[![Codeship](https://img.shields.io/codeship/20e197d0-3f4d-0133-ca24-22e25667a15e.svg?style=flat-square)](https://codeship.com/projects/103052)

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
or
```js
var rules = [
  {'page': {val: /.+/, should: true}}
];
```

User viewed any page BUT page 3:
```js
var rules = [
  {'page': {val: '*', should: true}},
  {'page': {val: 3, should: false}}
];
```

# complex rules exemple
The following rules can be used in ```val``` to compute complex rules:
```js
{$gt: 0} //true if event val is greater than the value
{$lt: 0} //true if event val is lesser than the value
{$gte: 0} //greater than or equal
{$lte: 0} //lesser than or equal
```
Value can be a ```Date```, number, string, etc. Anything natively comparable in JS


User should have made more than 10 clicks:
```js
var events = [
 {'clicks': {val: 12}}
];
var rules = [
  {'clicks': {val: {$gt: 10}, should: true}}
];
```


# OR conditions and optional rules
You can specify some rules as optional, thus if they don't match, other rules will have priority.

User should do more than 10 clicks OR less than 3 pageviews:
```js
var events = [
 {'clicks': {val: 12}}
];
var rules = [
  {'clicks': {val: {$gt: 10}, should: true, optional: true}},
  {'views': {val: {$lt: 3}, should: true, optional: true}}
];
```

If none are matched, it will be rejected. If one of the two matches, its a true!

You can then make some complex scenario, like:
User should do more than 10 clicks, AND (views less than 3 pages OR make 1 comment)
```js
var events = [
 {'clicks': {val: 12}}
];
var rules = [
  {'clicks': {val: {$gt: 10}, should: true}},
  {'views': {val: {$lt: 3}, should: true, optional: true }},
  {'comments': {val: 1, should: true, optional: true }}
];
```