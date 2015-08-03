import * as React from 'react';
import { Observable } from 'rx';
import { DOM } from 'react';
import { Viewer } from './views/viewer';
import { Button, MakeItSo } from './buttons';
import { todoAdded, todoRemoved } from './actions/todo';
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

export class HelloComponent extends React.Component<any, any> {

    render() {
        return DOM.h1({}, this.props.children);
    }
}

export class App extends React.Component<any, any> {

    handleKeyDown(evt: React.KeyboardEvent) {
        if (evt.keyCode == 13) {
            todoAdded((<any>evt.target).value);
            (<any>evt.target).value = "";
        }
    }

    renderTodo(todo: string, key: number) {
        return DOM.li({ key, onClick: evt => todoRemoved(key) }, todo);
    }

    render() {
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;
        let { state, action } = this.props;
        const Hello = React.createFactory(HelloComponent);
        let data = retrieve(github('users', state.github.username, 'events'));

        function githubFilter(observable: Observable<any>) {
            let watch = observable.filter((event: any) => event.type === 'WatchEvent');
            let other = observable.filter((event: any) => event.type != 'WatchEvent');
            return { watch, other };
        }

        return DOM.div({},
            React.createElement(Viewer, { data: this.props }),
            makeMultipleObservablesContainer({ data: githubFilter(data), scheduler },
                makeGitHubEvents({ name: 'WatchEvent', ref: 'watch' }),
                makeGitHubEvents({ name: 'Other Events', ref: 'other' })
                )
            );
    }
}

