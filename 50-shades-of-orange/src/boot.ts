import { retrieve } from './retrieve';

function generic(url: string): any {
    return {
        withCredentials: false,
        uri: url,
        headers: { 'User-Agent': 'node', Accept: 'application/json' },
    };
}

export function github(...parts: string[]): any {
    const token = 'a2391405a43cd6462bf24b47d4c8c6dfb18e3095';
    return {
        withCredentials: false,
        uri: 'https://api.github.com/' + parts.join("/"),
        headers: { 'User-Agent': 'node', 'Authorization': 'token ' + token }
    };
}

export function wrench(lane_name: string, host_id: number, commit: string) {
    return {
        // uri: `https://wrench.internalx.com/Wrench/GetStatus.aspx?lane_name=${lane_name}&host_id=${host_id}&commit=${commit}`
        uri: `http://localhost:3000/dist/logs/${commit}.json`
    }
}

export let github$ = retrieve(generic('http://localhost:3000/is-authorized.json'), ['github']);
