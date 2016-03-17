import { Component } from 'react';
import * as React from 'react';

import { Change, GitHubHelper } from './github-helper';
import { githubInitialized } from './actions';
import { State } from './state';

export const ChangeView = ({data}) => <p><textarea defaultValue={JSON.stringify(data)} /></p>;

export class App extends Component<State, {}> {
    private input;

    constructor(props) { super(props); }

    render() {
        let {files}  = this.props;
        return (
            <div>
                <input size='100' ref={r => this.input = r } />
                <button onClick={evt => githubInitialized(this.input.value)}>
                    Run!
                </button>
                <hr />
                {files && files.map((c, i) => <ChangeView key={i} data={c}/>) }
            </div>
        );

    }
}