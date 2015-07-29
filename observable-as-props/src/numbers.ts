import http = require("http");
import url = require("url");
import Rx = require("rx");
import express = require("express");
import _ = require('lodash');
//import cors = require('cors');

var app = express();
let port = 8080;
var count = 2000;

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', `http://localhost:${3000}`);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);
//app.use(cors())

function random2(n: number) {
    let data = Rx.Observable.fromArray(_.shuffle(_.range(0, count)));
    let subject = new Rx.Subject();
    data.subscribe(d => setTimeout(() => subject.onNext(d), 1000));
    return data;
}

app.get('/numbers', (req: any, res: any) => {
    console.log("Got request");
    res.setHeader('Content-Type', 'application/json');
    //res.end(JSON.stringify( _.range(50) ));
    res.write('[');
    //randomObservable(count, count)
    random2(count)
        .observeOn(Rx.Scheduler.currentThread)
        .do((v: number) => { console.log('sending', v) })
        .subscribe(
            function(d) { res.write(d + ','); /*console.log(d + ',');*/ },
            function(e) { console.log(e); },
            function() { res.end(count + ']'); /*console.log(count + ',');*/ }
            );

});

app.use(express.static('.'));

app.listen(port, function() {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
