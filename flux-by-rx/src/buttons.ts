import * as React from 'react';
import { DOM } from 'react';
import { makeItSoClicked } from './actions/button';

export class Button extends React.Component<any, any> {
    onClick = () => this.props.handler(!this.props.value);

    render = () => {
        return DOM.button({ onClick: this.onClick }, this.props.value ? "On" : "Off");
    }
}

export class MakeItSo extends React.Component<any, any> {

    render = () => {
        return DOM.button({ onClick: () => makeItSoClicked(true), disabled: this.props.isDisabled }, "Make it so!");
    }
}
