/*global require */

var React = require('react');
var App   = require('./app');

window.onload = function() {
  React.render(React.createElement(App, {}), document.getElementById('app'));
};

