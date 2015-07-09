import React  = require('react');
import Router = require('react-router');

class App extends React.Component<any, any> {
    render () { return React.createElement(Router.RouteHandler); }
}

export = App;
