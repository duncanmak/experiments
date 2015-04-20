// Type definitions for React Router 0.13.2
// Project: https://github.com/rackt/react-router
// Definitions by: Duncan Mak <https://github.com/duncanmak>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../react/react.d.ts" />

declare module ReactRouter {

    // Based on https://github.com/rackt/react-router/tree/master/docs/api

    interface Router<P, S, T extends LocationBase> {
        run(routes: React.ReactElement<RouteProp>, location?: T, callback?: RouterRunCallback<P, S>): void;
        create(options: RouterCreateOption<T>): Router<P, S, T>;
    }

    function run<P, S>(routes: Route, callback?: RouterRunCallback<P, S>): void;
    function run<P, S, T extends LocationBase>(routes: Route, location?: T, callback?: RouterRunCallback<P, S>): void;

    function create<P, S, T extends LocationBase>(options: RouterCreateOption<T>): Router<P, S, T>;

    interface RouterState {
        path: string;
        action: string;
        pathname: string;
        params: {};
        query: {};
        routes : React.ReactElement<RouteProp>;
    }

    interface RouterCreateOption<T extends LocationBase> {
        routes: React.ReactElement<RouteProp>;
        location?: T;
        scrollBehavior?: ScrollBehavior;
    }

    interface RouterRunCallback<P, S> {
        (Handler: React.ComponentClass<P>, state: RouterState): void;
    }

    interface RouterContext {
        transitionTo(to: string, params?: {}, query?: {}): void;
        replaceWith(to: string, params?: {}, query?: {}): void;
        goBack(): void;
        makePath(to: string, params?: {}, query?: {}): string;
        makeHref(to: string, params?: {}, query?: {}): string;

        getCurrentPath(): string;
        getCurrentPathname(): string;
        getCurrentParams(): string;
        getCurrentQuery(): string;
        isActive(routeName: string, params: {}, query: {}): boolean;
        getCurrentRoutes(): Route[];
    }

    interface LocationBase {
        getCurrentPath(): void;
        toString(): string;
    }

    interface LocationListener {
        addChangeListener(listener: Function): void;
        removeChangeListener(listener: Function): void;
    }

    interface MutableLocation {
        push(path: string): void;
        replace(path: string): void;
        pop(): void;
    }

    interface Location extends LocationBase, LocationListener, MutableLocation {}
    interface RefreshLocation extends LocationBase, MutableLocation {}

    var HashLocation:    Location;
    var HistoryLocation: Location;
    var RefreshLocation: RefreshLocation;
    var LocationBase:    LocationBase;
    var TestLocation:    Location;

    interface Transition {
        abort(): void;
        redirect(to: string, params?: {}, query?: {}): void;
        retry(): void;
    }

    //
    // Renderable Components
    //
    interface RouteHandler extends React.ComponentClass<any> {
        willTransitionTo(
            transition: Transition,
            params: {},
            query: {},
            callback: Function
        ): void;

        willTransitionFrom(
            transition: Transition,
            component: React.ReactElement<any>,
            callback: Function
        ): void;
    }

    var RouteHandler: RouteHandler;

    interface LinkProp {
        to: string;
        params?: {};
        query?: {};
        activeClassName?: string;
        activeStyle?: string;
        onClick?: Function;
    }

    var Link: React.ComponentClass<LinkProp>;

    //
    // Configuration Components
    //
    interface RouteProp {
        handler: React.ComponentClass<any>;
        name?: string;
        path?: string;
        children?: Route[];
        ignoreScrollBehavior?: any // TODO
    }

    type Route = React.ReactElement<RouteProp>;

    var Route: React.ComponentClass<RouteProp>;
    var DefaultRoute: React.ComponentClass<RouteProp>;
    var NotFoundRoute: React.ComponentClass<RouteProp>;

    interface RedirectProp {
        from: string;
        to: string;
        params?: {};
        query?: {};
    }
    var Redirect: React.ComponentClass<RedirectProp>;

    interface ScrollBehavior {
        updateScrollPosition(position: {x: number; y: number;}, actionType: string): void;
    }

     var ImitateBrowserBehavior: ScrollBehavior;
     var ScrollToTopBehavior: ScrollBehavior;
}

declare module "react-router" {
    import React = require('react');
    export = ReactRouter
}
