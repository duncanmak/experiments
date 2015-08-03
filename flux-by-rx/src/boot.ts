import { retrieve } from './retrieve';
import { Options } from 'request';

function generic(url: string): Options {
    return {
        withCredentials: false,
        uri: url,
        headers: { 'User-Agent': 'node', Accept: 'application/json' },
    };
}

export function github(...parts: string[]): Options {
    const token = '0a567c9eff0786125472ff108082763d6b9b92d3';
    return {
        withCredentials: false,
        uri: 'https://api.github.com/' + parts.join("/"),
        headers: { 'User-Agent': 'node', 'Authorization': 'token ' + token }
    };
}

export let github$ = retrieve(generic('http://localhost:8080/is-authorized'), ['github']);
