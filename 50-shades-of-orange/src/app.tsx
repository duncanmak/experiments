import * as React from 'react';
import { Observable } from 'rx';
import { DOM } from 'react';
import { Viewer } from './views/viewer';

import { filterEvent } from './actions/filterEvent';
import { clearActions } from './actions/clearActions';
import { get, pick, property } from 'lodash';
import { GitHubEvents } from './views/github-events';
import { SingleObservableContainer, MultipleObservablesContainer } from './views/containers';
import { github, wrench } from './boot';
import { retrieve } from './retrieve';
import { List } from './views/list';
import { StatusList } from './views/status';
import { Grid } from './views/grid';
import { Log } from './wrench-support';

const RxDOM = require('rx-dom');
const makeSingleObservableContainer = React.createFactory(SingleObservableContainer);

export class App extends React.Component<any, any> {

    handleKeyDown(evt: React.KeyboardEvent) {
        if (evt.keyCode == 13) {
            filterEvent((evt.target as any).value);
        }
    }

    listStatusesOfCommit(owner: string, repo: string, commit: string) {
        return retrieve(github('repos', owner, repo, 'commits', commit, 'status'), false).take(50);
    }

    // TODO: This needs to consider merge commits
    listCommits(owner: string, repo: string, branch: string): Observable<any> {
        let shas = Observable.fromArray([
            'bdbf45b96159074285c64eb1f43f6e743ecdcc52',
            '82e0a0b83d58e6c696f0aed9811749e2a44de1ca',
            '174388a9de0349ead1b3fa23c3654cb23dc8a589',
        ]);
        let logs = shas.flatMap(sha => retrieve(wrench('macios-mac-cycle6', 212, sha), false))
        return logs;
    }

    render() {
        console.log("rendering app");
        let scheduler = RxDOM.Scheduler.requestAnimationFrame;
        let { state, action } = this.props;
        // let data = this.listCommits('xamarin', 'maccore', 'cycle6');
        let data = this.listStatusesOfCommit('xamarin', 'maccore', 'bdbf45b96159074285c64eb1f43f6e743ecdcc52');
        return (
            <div>
                <Viewer data={ this.props } />
                <h1>50 Shades of Orange</h1>

                {makeSingleObservableContainer(
                    {scheduler, data},
                    // React.createElement(Grid, { cellHeight: 100, cellWidth: 100 }))}
                    React.createElement(StatusList, {})
                )}
            </div>
        );
    }
}

