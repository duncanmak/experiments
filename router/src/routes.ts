import React  = require('react');
import Router = require('react-router');

import App = require('./app');
import Foo = require('./foo');
import Bar = require('./bar');

var Route = React.createFactory(Router.Route);
var DefaultRoute = React.createFactory(Router.DefaultRoute);

var routes = Route(
    { name: 'app', path: '/', handler: App },
    Route({ name: 'foo', path: '/foo', handler: Foo }),
    Route({ name: 'bar', path: '/bar', handler: Bar })
);

export = routes;
