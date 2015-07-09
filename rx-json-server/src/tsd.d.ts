/// <reference path="../typings/JSONStream/JSONStream.d.ts" />
/// <reference path="../typings/express-session/express-session.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/form-data/form-data.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/moment/moment-node.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/request/request.d.ts" />
/// <reference path="../typings/rx/rx-lite.d.ts" />
/// <reference path="../typings/rx/rx.d.ts" />
/// <reference path="../typings/glob/glob.d.ts" />
/// <reference path="../typings/minimatch/minimatch.d.ts" />
/// <reference path="../typings/rx/rx.async-lite.d.ts" />
/// <reference path="../typings/compression/compression.d.ts" />

declare module Rx {
	interface ObservableStatic {
		pairs<T>(obj: T): Rx.Observable<T>
	}
}
