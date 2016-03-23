import { Subject } from 'rx';
import { curry } from 'lodash';
import { Change, GitHubHelper } from './github-helper';
import { State } from './state';

type S = State | Promise<State>
export interface Action { (state: State): S };
export const Actions = new Subject<Action | S>();

export async function initialAction(state: State) {
    console.log("First!");
    return state;
}

export function githubInitialized(text: string) {
    let [token, repo, branch] = text.split(' ');
    Actions.onNext(initializeGitHub(repo, token, branch));
};

const initializeGitHub = curry(
    async (repo: string, token: string, branch: string, state: State) => {
        let github = state.github || new GitHubHelper();
        await github.setup(token, repo, branch);
        let message = "Logged in";
        let files = new Map(), changes = new Map();
        return { changes, files, github, message };
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

export function xmlValidated(path: string, text: string) {
    Actions.onNext(validateXml(path, text));
}

const validateXml = curry(
    (path: string, text: string, state: State) => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(text, "text/xml");
        let error = dom.documentElement.nodeName == "parsererror";
        let message = `${path} is ${error ? "invalid" : "valid"}`;
        return Object.assign(state, { message })
    }
)