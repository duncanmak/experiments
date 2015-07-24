import * as React from 'react';
import { DOM } from 'react';
import { leftButtonClicked, rightButtonClicked } from './actions/button';
import { pathChanged } from './actions/viewer';
import { get } from 'lodash';

class Button extends React.Component<any, any> {
    onClick = () => this.props.handler(!this.props.value);

    render = () => {
        return DOM.button({ onClick: this.onClick }, this.props.value ? "On" : "Off");
    }
}

class MakeItSo extends React.Component<any, any> {

    onClick = () => {
        leftButtonClicked(true);
        rightButtonClicked(true);
    }

    render = () => {
        return DOM.button({ onClick: this.onClick, disabled: this.props.isDisabled }, "Make it so!");
    }
}

class Viewer extends React.Component<any, any> {
    render() {
        let { data: { state } } = this.props;

        return DOM.div({},
            DOM.input({ type: 'text', defaultValue: '', onChange: (evt) => pathChanged((<any>evt.target).value) }),
            JSON.stringify(get(state, state.path, state)));
    }
}

export class App extends React.Component<any, any> {
    render() {
        let { state, action } = this.props;
        return DOM.div({},
            React.createElement(Viewer, { data: this.props }),
            React.createElement(MakeItSo, state),
            React.createElement(Button, { value: state.leftClicked, handler: leftButtonClicked }),
            React.createElement(Button, { value: state.rightClicked, handler: rightButtonClicked }));
    }
}

