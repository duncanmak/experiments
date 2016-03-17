import { Change, GitHubHelper } from './github-helper';
import { Subject } from 'rx';
import { Actions } from './actions';

export interface State {
    repo: string;
    token: string;
    changes: Map<string, string>;
    files: Map<string, string>;
    helper: GitHubHelper;
    message: string;
}

export const InitialState: State = {
    repo: '',
    token: '',
    changes: new Map(),
    files: new Map(),
    helper: undefined,
    message: 'Ready'
};


export const States = new Subject<State|Promise<State>>();

