'use strict';

var AgeSlider = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    displayName: 'AgeSlider',
    getInitialState: function() {
        return {
            numbers: [1,2,3,4,5],
            age: 25,
            name: "Daniel",
            color: "red",
            owner: "Eric"
        };
    },

    nameChanged: function(evt) {
        var name = evt.target.value;
        var capitalized = name ? name[0].toUpperCase() + name.slice(1) : "";
        this.setState({name: capitalized });
    },
    render: function () {
        var style = { color: this.state.color };
        return <div>
            <div>Here are some numbers</div>
            <ul>
            { this.state.numbers.filter(function(i) { return i % 2 == 0; }).map(function(i) { return <li>{i}</li>; }) }
            </ul>
            This is <b>{this.state.owner}</b>'s age-slider. <b>{this.state.name}</b> lets me borrow it.
            He likes the color <span style={style}>{this.state.color}</span>.
            I am <b>{this.state.age}</b> years old.
            <p><label>Age:</label>
            <input type="range" valueLink={this.linkState('age')} />
            <label>Name:</label>
            <input value={this.state.name} onChange={this.nameChanged} placeholder="Enter name..." />
            </p>
        </div>;
    }
});

React.render(<AgeSlider />, document.getElementById('age-slider'));
