import { Change, GitHubHelper } from './github-helper';
import { Subject } from 'rx';

export interface State {
    repo: string;
    token: string;
    changes: Change[];
    files: string[];
    helper: GitHubHelper;
}

export const InitialState: State = {
    repo: '',
    token: '',
    changes: [],
    files: [],
    helper: undefined
};

export const States = new Subject<State|Promise<State>>();
