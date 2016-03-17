import { Subject } from 'rx';
import { curry } from 'lodash';
import { Change, GitHubHelper } from './github-helper';
import { State } from './state';

export interface Action { (state: State): State|Promise<State> };
export const Actions = new Subject<Action>();

export function githubInitialized (text: string) {
    let [token, repo] = text.split(' ');
    console.log(token, repo);
    Actions.onNext(initializeGithub(repo, token));
};

function initializeGithub(repo: string, token: string) {
    return async function initializeGithub(state: State) {
        let helper = state.helper || new GitHubHelper(token, repo);
        await helper.setup();
        let message = "Logged in";
        return Object.assign({}, state, {repo, token, helper, message});
    };
}

export function filesListed () { Actions.onNext(listFiles); }

async function listFiles(state: State) {
    console.log('state', state);
    const helper = state.helper;
    let entries = await helper.listFiles();
    let files = await Promise.all(await entries.map(async (e) => {
        let path: string = e.path;
        let content = await helper.download(e.download_url);
        return <[string, string]>[path, content];
    }));

    console.log('files', JSON.stringify(files));
    return Object.assign({}, state, { files: new Map(files) });
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

        return Object.assign({}, state, {changes});
    });

export function changesCommitted(msg: string) {
    Actions.onNext(commitChanges(msg));
}

const commitChanges = curry(
    async (msg: string, s: State) => {
        let {helper, changes} = s;
        for (let c of changes) {
            helper.change({ path: c[0], content: c[1] });
        }
        await helper.commit(msg);
        return s;
    }
);

export function messageUpdated(msg: string) {
    Actions.onNext(updateMessage(msg));
}

// const updateMessage = curry(
//     (message: string, state: State) => Object.assign({}, state, {message})
// );

function updateMessage(message: string) {
    return function updateMessage(state: State) {
        console.log('new message', message);
        return Object.assign({}, state, {message});
    }
}