// From https://github.com/rackt/react-router/blob/master/docs/guides/overview.md

import React  = require('react');
import Router = require('react-router');

var Link         = React.createFactory(Router.Link);
var DefaultRoute = Router.DefaultRoute;
var Route        = Router.Route;
var RouteHandler = Router.RouteHandler;

var DOM = React.DOM;

class App extends React.Component<any, any> {
    DisplayName = 'App';
    render() {
        return DOM.div(
            {},
            DOM.header(
                {},
                DOM.ul(
                    {},
                    DOM.li({}, Link({to: 'app'}, 'Dashboard')),
                    DOM.li({}, Link({to: 'inbox'}, 'Inbox')),
                    DOM.li({}, Link({to: 'calendar'}, 'Calendar'))),
                'Logged in as Jane'),
            React.createElement(Router.RouteHandler, {}));
    }
}

class Inbox extends React.Component<any, any> {
    DisplayName = 'Inbox';
    render = () => DOM.p ({}, 'Inbox');
}

class Calendar extends React.Component<any, any> {
    DisplayName = 'Calendar';
    render = () => DOM.p ({}, 'Calendar');
}

class Dashboard extends React.Component<any, any> {
    DisplayName = 'Dashboard';
    render = () => DOM.p ({}, 'Dashboard');
}

var routes = Route(
    { name: 'app', path: '/', handler: App },
    Route({ name: 'inbox', handler: Inbox }),
    Route({ name: 'calendar', handler: Calendar }),
    DefaultRoute({ handler: Dashboard }));

Router.run(routes, function (Handler) {
    React.render(React.createElement(Handler, {}), document.body);
});
