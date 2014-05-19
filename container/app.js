/*jslint indent: 4, nomen: true, sloppy: true */
/*global _, document, Counter, Hello, React, Router */

var contentNode = document.getElementById('content'),

    TopBar = React.createClass({
        getInitialState: function () {
            return { current: false };
        },

        componentDidMount: function () {
            var router = this.prepareRouter();
            router.init();
        },

        isActiveApp: function (app) {
            return (this.state.current === app) ? { className: "active" } : {};
        },

        handleClick: function (app) { this.setState({ current: app }); },

        render: function () {
            var self = this;
            return React.DOM.div(
                { className: "navbar navbar-inverse navbar-fixed-top" },
                React.DOM.div(
                    {className: "container"},
                    React.DOM.div(
                        { className: "navbar-header" },
                        React.DOM.a({ className: "navbar-brand", href: "#" }, "Dashboard")
                    ),
                    React.DOM.div(
                        { className: "collapse navbar-collapse" },
                        React.DOM.ul(
                            { className: "nav navbar-nav" },
                            this.props.apps.map(function (app) {
                                return React.DOM.li(
                                    self.isActiveApp(app),
                                    React.DOM.a(
                                        { href: "#" + app.label, onClick: self.handleClick.bind(self, app) },
                                        app.label));
                            })
                        )
                    )
                )
            );
        },
        //
        // internal
        //
        mountApplication: function (app) {
            React.unmountComponentAtNode(contentNode);
            React.renderComponent(app({}), contentNode);
        },

        prepareRouter: function () {
            var self     = this,
                handlers = this.props.apps.map(function (app) { return self.mountApplication.bind(self, app); });
            return Router(_.object(_.pluck(this.props.apps, "label"), handlers));
        }
    });


var apps = [Hello, Counter];

React.renderComponent(
    TopBar({apps: apps}),
    document.getElementById('app-top-bar')
);
