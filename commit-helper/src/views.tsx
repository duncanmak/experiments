import { Component } from 'react';
import { Change, GitHubHelper } from './app';
import * as React from 'react';

export const ChangeView = ({data}) => <textarea defaultValue={JSON.stringify(data)} />

export class MainView extends Component<any, {changes: Change[]}> {
    input;
    helper: GitHubHelper;

    constructor(props) {
        super(props);
        this.state = {changes: []};
    }

    renderLabel(name) {
        return (<p>{name} <input ref={r => this[name] = r}/></p>);
    }

    async handleClick(evt) {
        const [token, repo, branch] = this.input.value.split(' ');
        this.helper = new GitHubHelper(token, repo, branch);
        await this.helper.setup(c => this.changeAdded(c));
        await this.helper
            .change({ path: 'foo', content: 'This is foo 8' })
            .change({ path: 'bar', content: 'This is bar 8' })
            .commit('This is a test');
    }

    changeAdded(c) {
        this.setState({ changes: [...this.state.changes, c]});
    }

    render() {
        return (
            <div>
                <input size='100' ref={r => this.input = r } />
                <button onClick={e => this.handleClick(e)}>
                    Run!
                </button>
                <hr />
                {this.state.changes.map((c, i) => <ChangeView key={i} data={c}/>)}
            </div>
        );
    }
}

// async function test(token, repo) {
//     helper
//         .change({ path: 'foo', content: 'This is foo 7' })
//         .change({ path: 'bar', content: 'This is bar 7' })
//         .showFiles();

//     let result = await helper.commit('This is a message');
//     console.log(JSON.stringify(result));
//     helper.showFiles();
// }
