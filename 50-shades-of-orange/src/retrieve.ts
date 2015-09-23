import * as JSONStream from "JSONStream";
import { Observable, Subject } from 'rx';
import { IncomingMessage } from 'http';
import * as request from 'request';
import { extend, get } from 'lodash';

// require('core-js');

let Readable = require('stream').Readable
let parseLinkHeader = require('parse-link-header');

interface Response { etag: string; data?: any[]; }
// type Cache = Map<string, Response>;

// let cache: Cache = new Map<string, Response>([]);

// export function retrieve(options: request.Options, expr: any = [true]) {
//     if (cache.has(options.uri)) {
//         let subject = new Subject();
//         let NOT_MODIFIED = 304;
//         let entry = cache.get(options.uri);
//         options.headers['If-None-Match'] = entry.etag;

//         let r = request(options);

//         r.on('response', (resp: IncomingMessage) => {
//             if (resp.statusCode === NOT_MODIFIED) {
//                 console.log('loading', entry.data.length, 'entries from cache');
//                 Observable.fromArray(entry.data).subscribe(subject);
//             } else {
//                 cache.delete(options.uri);
//                 retrieveFromNetwork(options, expr).subscribe(subject);
//             }
//         });

//         return subject;
//     } else {
//         return retrieveFromNetwork(options, expr);
//     }
// }

export function retrieve(opts: request.Options, expr: any = [true]) {
    let disposed = false;
    let initialUri = opts.uri;
    let nextLink = (resp: IncomingMessage) =>
        get<string>(parseLinkHeader(resp.headers['link']), ['next', 'url']);

    return Observable.create((observer) => {

        let go = (options: request.Options) => {
            let nextUri: string = undefined;

            if (options.uri === undefined || disposed) {
                observer.onCompleted();
            } else {
                console.log('fetching', options.uri);
                let incoming = request(options)
                    .on('error', (e: any) => observer.onError(e))
                    .on('response', (resp: IncomingMessage) => {
                        nextUri = nextLink(resp);
                        // NOTE: Only store the etag from the request to the initial URI
                        if (options.uri === initialUri) {
                            let etag = resp.headers['etag'];
                            // cache.set(initialUri, { etag, data: [] })
                        }
                    });
                if (expr) {
                    incoming.pipe(JSONStream.parse(expr))
                        .on('error', (e: any) => observer.onError(e))
                        .on('data', (data: any) => {
                            // NOTE: Always use the initial URI as the key for cache
                            // cache.get(initialUri).data.push(data);
                            observer.onNext(data);
                        })
                        .on('end', () => go(extend({}, options, { uri: nextUri })))
                } else {
                    let chunks: any[] = [];
                    incoming
                        .on('data', (data: string) => chunks.push(data))
                        .on('end', () => {
                            observer.onNext(JSON.parse(chunks.join("")))
                            observer.onCompleted();
                        })
                }
            }
        }

        go(opts);

        return () => { disposed = true; };
    });
}
