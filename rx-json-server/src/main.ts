import Entry     = require('./entry');
import fs        = require('fs');
import moment    = require('moment');
import p         = require('path');
import glob      = require('glob');
import Immutable = require('immutable');
import express   = require('express');
import url       = require('url');
import _         = require('lodash');

function LazyBotEndPoint(app: any, path: any) {

    var ROOT = p.join('/srv/data/LazyBot-data');
    var DATE_FORMAT = 'YYYY-MM-DD';
    var START_DEFAULT = '2014-07-18';

    var minDate = moment().format(DATE_FORMAT);
    var maxDate = START_DEFAULT;

    function loadFile(file: string): Immutable.Map<string, any> {
        try {
            return Immutable.Map<string, any>(JSON.parse(fs.readFileSync(file, 'utf8')).hostHistory);
        } catch (err) {
            console.log('Error:', err);
            return Immutable.Map<string, any>();
        }
    }

    function filterByDate(histories: Immutable.Map<string, Immutable.List<any>>, start: moment.Moment, end: moment.Moment) {
        var inRange = (i: any) => {
            var time = moment(i.date, 'YYYY-MM-DD');
            return time.isBefore(start) || time.isAfter(end);
        };

        return histories.reduce(
            (res, hist, host) => res.set(host, hist.filterNot(inRange)),
            Immutable.Map<string, any>());
    }

    function uniq(hostHistory: Immutable.Map<string, Immutable.List<any>>, identifier: Function) {
        var result = {uniq: Immutable.List(), seen: Immutable.Set()};

        return hostHistory.reduce(
            (res, h) => (res.seen.contains(identifier(h)) ? res : {uniq: res.uniq.push(h), seen: res.seen.add(identifier(h))}),
            result).uniq;
    }

    function jobs(host: string, histories: Immutable.List<Immutable.Map<string, any>>): Immutable.List<any> {
        var byDateRevision = (i: any) => {
          var date = moment(i.date).format(DATE_FORMAT);
          minDate = date < minDate ? date : minDate;
          maxDate = date > maxDate ? date : maxDate;
          return JSON.stringify([i.date, i.revision]);
        };
        var isGood = (i: any) => i != undefined && i.completed;

        return uniq(histories.flatMap(i => i.get(host)).filter(isGood), byDateRevision);
    }

    function combine(histories: Immutable.Iterable<number, Immutable.Map<string, any>>): Immutable.Map<string, any> {
        var hosts = histories.flatMap(i => i.keys()).toSet();

        return hosts.reduce(
            (result: Immutable.Map<string, any>, h: string) => result.set(h, jobs(h, histories)),
            Immutable.Map<string, any>());
    }

    var t0 = moment();
    var histories = Immutable.List(glob.sync(p.join(ROOT, "*.json")).map(loadFile));
    console.log('initial size of histories', histories.size);
    var cache: Immutable.Map<string, any> = combine(histories);
    console.log('initial size of cache', cache.size);
    var t1 = moment();
    console.log('load cache:', t1.diff(t0, 'seconds', true));

    var watcher = fs.watch(ROOT, (e, filename) => {
        if (!_.endsWith(filename, '.json')) return undefined;
        console.log(filename, 'was updated');
        console.log('cache size before update', cache.size);
        cache = combine(Immutable.List([cache, loadFile(p.join(ROOT, filename))]));
        console.log('cache size after update', cache.size);
    });

    app.get(path, (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');

        var t5 = moment();
        var defaultRange = {start: START_DEFAULT, end: moment().format(DATE_FORMAT)};
        var query: any = _.merge(defaultRange, url.parse(req.url, true).query);
        res.end(JSON.stringify({data: filterByDate(cache, moment(query.start), moment(query.end)), minDate: minDate, maxDate: maxDate}));
        var t6 = moment();
        console.log('Query took:', t6.diff(t5, 'seconds'), 'seconds');
    });
}

export = LazyBotEndPoint;
