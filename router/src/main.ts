import React  = require('react');
import Router = require('react-router');
import routes = require('./routes');

Router.run(routes, (Handler, State) => {
    React.render(
        React.createElement(Handler),
        document.getElementById('app')
    );
});
