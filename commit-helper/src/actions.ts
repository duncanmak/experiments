import { Subject } from 'rx';
import { curry } from 'lodash';
import { Change, GitHubHelper } from './github-helper';
import { State } from './state';

type S = State | Promise<State>
export interface Action { (state: State): S };
export const Actions = new Subject<Action | S>();

export function githubInitialized(text: string) {
    let [token, repo] = text.split(' ');
    console.log(token, repo);
    Actions.onNext(initializeGithub(repo, token));
};

const initializeGithub = curry(
    async (repo: string, token: string, state: State) => {
        let github = state.github || new GitHubHelper();
        await github.setup(token, repo);
        let message = "Logged in";
        return Object.assign({}, state, { github, message });
    }
);

export function filesListed() { Actions.onNext(listFiles); }

async function listFiles(state: State) {
    let {github} = state;
    let entries = await github.listFiles();
    let files = new Map<string, string>();
    for (let e of entries) {
        files.set(e.path, await github.download(e.download_url));
    }
    return Object.assign({}, state, { files });
}

export function changesAdded(path: string, content: string) {
    Actions.onNext(addChanges(path, content));
}

const addChanges = curry(
    (path: string, content: string, state: State) => {
        console.log('adding changes to', path);
        console.log('new', content);

        let changes = new Map(state.changes);
        changes.set(path, content);

        return Object.assign({}, state, { changes });
    }
);

export function changesCommitted(msg: string) {
    Actions.onNext(commitChanges(msg));
}

const commitChanges = curry(
    async (message: string, state: State) => {
        let {github} = state;
        let makeChange = (c:[string, string]) => ({ path: c[0], content: c[1] });
        let changes = Array.from(state.changes).map(makeChange);
        await github.commit(changes, message);
        return state;
    }
);

export function messageUpdated(message: string) {
    Actions.onNext(updateMessage(message));
}

const updateMessage = curry(
    async (message: string, state: State) => {
        console.log('new message', message);
        return Object.assign({}, state, { message });
    }
);