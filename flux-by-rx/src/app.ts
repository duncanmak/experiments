import * as React from 'react';
import { Observable } from 'rx';
import { DOM } from 'react';
import { Viewer } from './views/viewer';

import { filterEvent } from './actions/filterEvent';
import { clearActions } from './actions/clearActions';
import { get } from 'lodash';
import { GitHubEvents } from './views/github-events';
import { SingleObservableContainer, MultipleObservablesContainer } from './views/containers';
import { github } from './boot';
import { retrieve } from './retrieve';

const RxDOM = require('rx-dom');
const makeGitHubEvents = React.createFactory(GitHubEvents);
const makeSingleObservableContainer = React.createFactory(SingleObservableContainer);
const makeMultipleObservablesContainer = React.createFactory(MultipleObservablesContainer);

export class App extends React.Component<any, any> {

    handleKeyDown(evt: React.KeyboardEvent) {
        if (evt.keyCode == 13) {
            filterEvent((<any>evt.target).value);
        }
    }

    render() {
        console.log("rendering app");
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;
        let { state, action } = this.props;
        let data = retrieve(github(state.github.token, 'users', state.github.username, 'events'));

        function githubFilter(observable: Observable<any>, evt: string) {
            console.log('filtering', evt);
            let left = observable.filter((event: any) => event.type === evt);
            let right = observable.filter((event: any) => event.type != evt);
            return { left, right };
        }

        return DOM.div({},
            React.createElement(Viewer, { data: this.props }),
            DOM.h1({}, "GitHub event viewer"),
            DOM.input({ defaultValue: state.event, onKeyDown: this.handleKeyDown }),
            React.createElement(MultipleObservablesContainer,
                { data: githubFilter(data, state.event), scheduler },
                makeGitHubEvents({ name: state.event, ref: 'left' }),
                makeGitHubEvents({ name: 'Other Events', ref: 'right' })
                )
            );
    }
}

