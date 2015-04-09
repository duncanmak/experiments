import React = require('react');
import Hello = require('./hello');

React.render(
    Hello({label: 'This is some text'}),
    document.getElementById('app')
);
