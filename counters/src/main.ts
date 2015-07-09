import React = require('react');

import App     = require('./app');
import Actions = require('./actions');

Actions.numbers.subscribe((c) => {
    React.render(
        React.createElement(App, { counter: c }),
        document.getElementById('app')
    );
})

Actions.numbers.onNext(1);
