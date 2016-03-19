import { Change, GitHubHelper } from './github-helper';
import { Subject } from 'rx';
import { Actions } from './actions';

export interface State {
    changes: Map<string, string>;
    files: Map<string, string>;
    github: GitHubHelper;
    message: string;
}

export const InitialState: State = {
    changes: new Map(),
    files: new Map(),
    github: undefined,
    message: 'Ready'
};

