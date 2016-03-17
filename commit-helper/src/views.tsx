import { Component } from 'react';
import * as React from 'react';

import { Change, GitHubHelper } from './github-helper';
import { changesAdded, changesCommitted, filesListed, githubInitialized } from './actions';
import { State } from './state';

export class ChangeView extends Component<Change, {}> {
    private input;

    constructor(props) { super(props); }

    render() {
        let {path, content} = this.props;
        return (<p>
                    {path}<br/>
                    <textarea defaultValue={content} ref={r => this.input = r} />
                    <button onClick={evt => changesAdded(path, this.input.value)}>Add Change</button>
               </p>);
    }
}

export class App extends Component<State, {}> {
    private input;
    private message;

    constructor(props) { super(props); }

    render() {
        let {changes, files, helper, message }  = this.props;
        return (
            <div>
                <input size='100' ref={r => this.input = r } />
                <button onClick={evt => githubInitialized(this.input.value)}>Login</button>
                <hr />
                <button onClick={evt => filesListed()} disabled={!helper}>List Files</button>
                <button onClick={evt => changesCommitted(this.message.value)} disabled={changes.size === 0}>Commit!</button>
                <input ref={r => this.message = r} />
                <p>{message}</p>

                {files && Array.from(files).map((c, i) => <ChangeView key={i} path={c[0]} content={c[1]}/>) }
            </div>
        );

    }
}