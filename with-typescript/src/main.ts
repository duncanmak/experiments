import React = require('react');
import Hello = require('./hello');

React.render(
    React.createElement(Hello, null),
    document.getElementById('app')
);
