import { Component } from 'react';
import * as React from 'react';

import { Change, GitHubHelper } from './github-helper';
import { changesAdded, changesCommitted, filesListed, githubInitialized, messageUpdated, xmlValidated } from './actions';
import { State } from './state';

export class ChangeView extends Component<Change, any> {
    private input;

    constructor(props) {
        super(props);
        this.state = { changed: false }
    }

    textChanged() { this.setState({changed: true}); }

    render() {
        let {path, content} = this.props;
        return (<p>
                    {path}<br/>
                    <textarea defaultValue={content} ref={r => this.input = r} onChange={evt => this.textChanged()}/>
                    <button
                        onClick={evt => changesAdded(path, this.input.value)}
                        disabled={!this.state.changed || this.input.value === content}>
                        Add Change!
                    </button>
                    <button
                        onClick={evt => xmlValidated(path, this.input.value)}>
                        Validate!
                    </button>
               </p>);
    }
}

export class App extends Component<State, {}> {
    private input;
    private message;

    constructor(props) { super(props); }

    isLoggedIn() {
        let { github } = this.props;
        return github !== undefined;
    }

    render() {
        let {changes, files, github, message} = this.props;
        return (
            <div>
                <input size='100' ref={r => this.input = r } />
                <button onClick={evt => githubInitialized(this.input.value)}>Login</button>
                <hr />
                <button onClick={evt => filesListed()} disabled={!this.isLoggedIn()}>List Files!</button>
                <button onClick={evt => changesCommitted(this.message.value)} disabled={changes.size === 0}>Commit!</button>
                <input onChange={evt => messageUpdated(`About to commit ${changes.size} files - ${Array.from(changes.keys())}`)}  ref={r => this.message = r} />
                <p>{message}</p>

                {files && Array.from(files).map((c, i) => <ChangeView key={i} path={c[0]} content={c[1]} />) }
            </div>
        );

    }
}