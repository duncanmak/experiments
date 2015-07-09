import _ = require('lodash');
import Entry = require('./entry');
import express = require('express');
import fs = require('fs');
import glob = require('glob');
import JSONStream = require('JSONStream');
import moment = require('moment');
import Rx = require('rx');
import path = require('path');
import url = require('url');

const RxNode  = require('rx-node');
const globObs = Rx.Observable.fromNodeCallback(glob);

type Moment = moment.Moment;

/**
 * Processes the jobs for a particular host
 *
 * @param hostEntry - Something that looks like this: { host1: [{ x: 1, y: 2 }, { x: 3, y: 4 }], host2: ... }
 * @return [ { x: 1, y: 2, host: 'a' }, ... ]
 */
function processHostEntries(hostEntries: any): Rx.Observable<any> {

    let host = hostEntries[0], entries = hostEntries[1];
    
    const isCompleted = (e: Entry) => e.completed;
    const withHost    = (e: Entry) => _({}).assign(e, { host }).omit('completed').value();

    return _.isEmpty(host) 
        ? Rx.Observable.empty() 
        : Rx.Observable.from(entries).filter(isCompleted).map(withHost);
}

function loadFile(filename: string): Rx.Observable<any> {
    let fileStream = fs.createReadStream(filename, { encoding: 'utf8' });
    let jsonStream = fileStream.pipe(JSONStream.parse(["hostHistory"]))
    return RxNode.fromReadableStream(jsonStream);
}

function isBetween(date: Moment, from: Moment, to: Moment) {
    return date.isAfter(from) && date.isBefore(to);
}

function listEntries(from: Moment, to: Moment) {
    return globObs('/srv/data/LazyBot-data/*.json')
        .flatMap(Rx.Observable.from)                 // Ob<filename[]>    => Ob<filename>
        .filter((s: string) => isBetween(moment(s, 'YYYY-MM-DD'), from, to))
        .flatMap(loadFile)                           // Ob<filename>      => Ob<{Pair}>          # loadFile (s) => obj
        .flatMap((i: any) => Rx.Observable.pairs(i)) // Ob<Pair>          => Ob<[key, values]>   # processHostEntries (pair) => Entry[]
        .flatMap(processHostEntries)                 // Ob<[key, values]> => Ob<Entry>
        .distinct((e: Entry) => e.revision)
}

function main(req: express.Request, res: express.Response, next: Function) {
    res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/json');
    res.writeHead(200);

    let range = { start: moment().subtract(1, 'week'), end: moment() }
    let query: any = _.assign({}, url.parse(req.url, true).query, range);
    let result = listEntries(query.start, query.end);
        
    res.write('[');
    result
        .subscribe(
            (e: Entry) => res.write(JSON.stringify(e) + ','),
            (err: any) => console.error(err),
            () => { res.write('{}]'); res.end(); next(); });
}

export = main;
