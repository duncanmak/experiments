var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _ = require('lodash');
var React = require('react');
var Rx = require('rx');
var DOM = React.DOM;
var App = (function (_super) {
    __extends(App, _super);
    function App(props) {
        _super.call(this, props, undefined);
        this.state = { subscription: undefined, aCounter: 0, bCounter: 0 };
    }
    App.prototype.componentDidMount = function () {
        var _this = this;
        var source = Rx.Observable.interval(1000).take(500);
        this.setState({
            subscription: source.subscribeOnNext(function (i) { return _this.setState(_.assign(_this.state, { aCounter: i })); }),
            aCounter: 0,
            bCounter: 0
        });
    };
    App.prototype.componentWillUnmount = function () {
        this.state.subscription.dispose();
    };
    App.prototype.render = function () {
        return DOM.h1({}, "This is a counter: " + this.state.aCounter);
    };
    return App;
})(React.Component);
React.render(React.createElement(App, {}), document.getElementById('app'));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6WyJBcHAiLCJBcHAuY29uc3RydWN0b3IiLCJBcHAuY29tcG9uZW50RGlkTW91bnQiLCJBcHAuY29tcG9uZW50V2lsbFVubW91bnQiLCJBcHAucmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLENBQUMsV0FBZSxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFPLEtBQUssV0FBVyxPQUFPLENBQUMsQ0FBQztBQUNoQyxJQUFPLEVBQUUsV0FBYyxJQUFJLENBQUMsQ0FBQztBQUU3QixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBUXBCLElBQU0sR0FBRztJQUFTQSxVQUFaQSxHQUFHQSxVQUFvQ0E7SUFFekNBLFNBRkVBLEdBQUdBLENBRU9BLEtBQVVBO1FBQ2xCQyxrQkFBTUEsS0FBS0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLFlBQVlBLEVBQUVBLFNBQVNBLEVBQUVBLFFBQVFBLEVBQUVBLENBQUNBLEVBQUVBLFFBQVFBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO0lBQ3ZFQSxDQUFDQTtJQUVERCwrQkFBaUJBLEdBQWpCQTtRQUFBRSxpQkFTQ0E7UUFSR0EsSUFBSUEsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFcERBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1lBQ1ZBLFlBQVlBLEVBQUVBLE1BQU1BLENBQUNBLGVBQWVBLENBQ2hDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFTQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxFQUFFQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUE1REEsQ0FBNERBLENBQUNBO1lBQ3RFQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUNYQSxRQUFRQSxFQUFFQSxDQUFDQTtTQUNkQSxDQUFDQSxDQUFDQTtJQUNQQSxDQUFDQTtJQUVERixrQ0FBb0JBLEdBQXBCQTtRQUNJRyxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUN0Q0EsQ0FBQ0E7SUFFREgsb0JBQU1BLEdBQU5BO1FBQ0lJLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLHdCQUFzQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDbkVBLENBQUNBO0lBQ0xKLFVBQUNBO0FBQURBLENBekJBLEFBeUJDQSxFQXpCaUIsS0FBSyxDQUFDLFNBQVMsRUF5QmhDO0FBRUQsS0FBSyxDQUFDLE1BQU0sQ0FDUixLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFDNUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FDakMsQ0FBQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6W10sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9