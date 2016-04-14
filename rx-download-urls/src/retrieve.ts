import * as JSONStream from "JSONStream";
import { Observable, Subject } from 'rx';
import { IncomingMessage } from 'http';
import { UriOptions } from 'request';
import { assign, get } from 'lodash';

const request = require('request');
const Readable = require('stream').Readable
const parseLinkHeader = require('parse-link-header');

interface Response { etag: string; data?: any[]; }

export function retrieve<T>(opts: UriOptions, expr: any = [true]) {
    let disposed = false;
    let initialUri = opts.uri;
    let nextLink = (resp: IncomingMessage) =>
        get<string>(parseLinkHeader(resp.headers['link']), ['next', 'url']);
    return Observable.create((observer) => {

        let go = (options: UriOptions) => {
            let nextUri: string = undefined;

            if (options.uri === undefined || disposed) {
                observer.onCompleted();
            } else {
                // console.log('fetching', options.uri);
                let incoming = request(options)
                    .on('error', (e: any) => observer.onError(e))
                    .on('response', (resp: IncomingMessage) => {
                        nextUri = nextLink(resp);
                        // NOTE: Only store the etag from the request to the initial URI
                        if (options.uri === initialUri) {
                            let etag = resp.headers['etag'];
                        }
                    });
                if (expr) {
                    incoming.pipe(JSONStream.parse(expr))
                        .on('error', (e: any) => observer.onError(e))
                        .on('data', (data: T) => {
                            // NOTE: Always use the initial URI as the key for cache
                            observer.onNext(data);
                        })
                        .on('end', () => go(assign({}, options, { uri: nextUri }) as UriOptions))
                } else {
                    let chunks = [];
                    incoming
                        .on('data', (data: string) => chunks.push(data))
                        .on('end', () => {
                            if (chunks.length > 0) {
                                observer.onNext(JSON.parse(chunks.join("")) as T);
                            }
                            observer.onCompleted();
                        })
                }
            }
        }

        go(opts);

        return () => { disposed = true; };
    }) as Observable<T>;
}
