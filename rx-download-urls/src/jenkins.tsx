import { Component } from 'react';
import * as React from 'react';
import { Observable } from 'rx';
import { retrieve } from './retrieve';
import { has } from 'lodash';

function jenkins(job: string, headers: Headers, rawInput: any, cause: string) {
    const JENKINS_URL = 'http://jenkins.bos.internalx.com/';

    let input = encodeURIComponent(JSON.stringify(rawInput));
    let url = `${JENKINS_URL}/job/${job}/buildWithParameters?cause=${cause}&input=${input}`;

    return fetch(url, { method: 'POST', headers });
}

export class Jenkins extends Component<{}, { output: string }> {
    private jobInput;
    private valueInput;
    private causeInput;

    state = { output: '' };

    async runJenkinsJob() {

        let username = 'duncanmak';
        let token = '';
        let headers = {
            'User-Agent': 'node',
            'Authorization': `Basic ${btoa(`${username}:${token}`)}`
        } as any;

        let job = this.jobInput.value as string;

        let resp = await jenkins(job, headers, this.valueInput.value, this.causeInput.value);
        let queueUrl = resp.headers.get('Location') + '/api/json';

        let _fetch = (url) => fetch(url, { method: 'GET', headers } as any);

        Observable
            .interval(3000)
            .flatMap(async (i) => await (await _fetch(`${queueUrl}/api/json`)).json())
            .do(_ => console.log('tick'))
            .filter(e => has(e, 'executable'))
            .take(1)
            .flatMap(async ({executable}) => await (await _fetch(executable.url + '/consoleText')).text())
            .subscribe(output => this.setState({ output }));
    }

    render() {
        return (
            <div>
                <p>Job <input rows={30} cols={200} ref={r => this.jobInput = r} defaultValue='test-parameterized-job'/></p>
                <p>Input <input rows={30} cols={200} ref={r => this.valueInput = r} defaultValue={JSON.stringify({hello: 'World'})}/></p>
                <p>Cause <input rows={30} cols={200} ref={r => this.causeInput = r} defaultValue='Text here'/></p>
                <p><button onClick={this.runJenkinsJob.bind(this)}>Run</button></p>
                <p><textarea rows={30} cols={200} readOnly={true} value={this.state.output} /></p>
            </div>
        );
    }
}

