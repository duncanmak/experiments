import { retrieve } from './retrieve';
import { Options } from 'request';

function generic(url: string): Options {
    return {
        withCredentials: false,
        uri: url,
        headers: { 'User-Agent': 'node', Accept: 'application/json' },
    };
}

export function github(token: string, ...parts: string[]): Options {
    return {
        withCredentials: false,
        uri: 'https://api.github.com/' + parts.join("/"),
        headers: { 'User-Agent': 'node', 'Authorization': 'token ' + token }
    };
}

export let github$ = retrieve(generic('http://localhost:3000/is-authorized.json'), ['github']);
