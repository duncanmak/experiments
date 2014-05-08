/*jslint indent: 4, sloppy: true */
/*global React, Hello, Counter, _ */

var contentNode = document.getElementById('content'),

    storageMixin = {
        componentWillMount: function() {
            this.storage = {};
        },
        put: function (k, v) {
            this.storage[k] = v;
        },

        get: function(k) { return k && this.storage[k]; }
    },

    Toggle = React.createClass({
        mixins: [storageMixin],

        getInitialState: function() {
            return { current: false };
        },

        loadApp: function(app) {
            var self = this;
            return function () {
                React.unmountComponentAtNode(contentNode);
                var instance = self.get(app.label);

                if (_.isUndefined(instance)) {
                    console.log("Loading " + app.label);
                    instance = app({});
                }
                React.renderComponent(
                    instance,
                    contentNode
                );

                self.put(app.label, instance);
            };
        },

        render: function () {
            var self = this;
            return React.DOM.div({
                className: "btn-group",
                children: this.props.apps.map(function (app) {
                    return React.DOM.button({
                        className: "btn btn-default",
                        children: app.label,
                        type: "button",
                        onClick: self.loadApp(app)
                    });
                })
            });
        }
    });

React.renderComponent(
    Toggle({apps: [Hello, Counter]}),
    document.getElementById('toggle')
);
