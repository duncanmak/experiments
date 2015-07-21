import * as React from 'react';
import { DOM } from 'react';
import { leftButtonClicked, rightButtonClicked } from './buttonIntent';

class Button extends React.Component<any, any> {
    onClick = () => {
        console.log("Clicked");
        this.props.handler(!this.props.value);
    }

    render = () => {
        return DOM.button({ onClick: this.onClick }, this.props.value ? "On" : "Off");
    }
}

class True extends React.Component<any, any> {

    onClick = () => {
        leftButtonClicked(true);
        rightButtonClicked(true);
    }

    render = () => {
        return DOM. button({ onClick: this.onClick, disabled: this.props.leftClicked == this.props.rightClicked }, "Make it so!");
    }
}

export class App extends React.Component<any, any> {
    render() {
        return DOM.div({},
            DOM.div({}, JSON.stringify(this.props)),
            React.createElement(True, this.props),
            React.createElement(Button, { value: this.props.leftClicked, handler: leftButtonClicked } ),
            React.createElement(Button, { value: this.props.rightClicked, handler: rightButtonClicked } ));
    }
}

