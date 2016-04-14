import { Component } from 'react';
import * as React from 'react';
import { Observable } from 'rx';
import { retrieve } from './retrieve';

const RxDOM = require('rx-dom');

export class App extends Component<{}, { entries: string[] }> {
    private urls;
    private content;

    state = { entries: [], count: 0 };

    loadUrls() {
        let urls = (this.urls.value as string).split('\n');
        Observable
            .from(urls)
            .flatMap(uri => retrieve({uri, withCredentials: false} as any))
            .bufferWithCount(100)
            .subscribe(e => {
                let entries = [...e, ...this.state.entries];
                this.setState({ entries })
            });
    }

    render() {
        const urls = [
       ].join('\n');
        return (
            <div>
                <p><textarea rows={30} cols={200} ref={r => this.urls = r} defaultValue={urls} /></p>
                <p><button onClick={this.loadUrls.bind(this)}>Load URLs</button></p>
                <p>{this.state.entries.length} entries</p>
                <p><textarea rows={30} cols={200} ref={r => this.content = r} readOnly={true} value={JSON.stringify(this.state.entries)} /></p>
            </div>
        );
    }
}

