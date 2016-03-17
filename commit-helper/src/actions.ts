import { Subject } from 'rx';
import { curry } from 'lodash';
import { Change, GitHubHelper } from './github-helper';
import { State } from './state';

export interface Action { (state: State): State|Promise<State> };
export const Actions = new Subject<Action>();

export const githubInitialized = (text: string) => {
    let [token, repo] = text.split(' ');
    Actions.onNext(initializeGithub(repo, token));
};

export const changeAdded = (c: Change) => Actions.onNext(addChange(c));

const initializeGithub = curry(
    async (repo: string, token: string, state: State) => {
        let helper = state.helper || new GitHubHelper(token, repo);
        await helper.setup(changeAdded);
        let files = await helper.listFiles();
        return Object.assign({}, state, {repo, token, helper, files});
    }
);

const addChange = curry(
  (change: Change, state: State) => {
      let changes = [change, ...state.changes];
      return Object.assign({}, state, { changes });
  }
);
