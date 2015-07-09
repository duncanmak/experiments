import Rx = require('rx');

var numbers = new Rx.ReplaySubject(1);

var actions = { numbers: numbers };

export = actions;
