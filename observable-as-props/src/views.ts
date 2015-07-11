import { Component, DOM, createFactory } from 'react';
import { Observable } from 'rx';

interface Props {
    name: string;
    values: any;
}

interface State {
    values: number[];
}

class ViewComponent<P extends Props> extends Component<P, State> {

    values() { return this.props.values; }

    render() {
        let time = () => {
            let d = new Date();
            return `${d.getSeconds()}s ${d.getMilliseconds()}ms`;
        };

        console.log(time(), 'render', this.props.name, this.values().length);
        return DOM.div(
            {},
            DOM.ul(
                { style: { float: 'left' } },
                DOM.div({}, this.props.name),
                this.values().map((v: number) => DOM.li({ key: v }, v))));
    }
}

export const View = createFactory(ViewComponent);

interface ObProps extends Props {
    scheduler: Rx.Scheduler;
    values: Observable<number>;
}

class ObViewComponent extends ViewComponent<ObProps> {

    constructor(props: any) {
        super(props);
        this.state = { values: [] };
    }

    componentDidMount() {
        this.props.values
            .bufferWithTime(20) // TODO: Replace this with a rAF timer?
            .observeOn(this.props.scheduler)
            .subscribe(i => {
                this.setState({ values: this.state.values.concat(i) });
            });
    }

   values() { return this.state.values; }
}

export const ObView = createFactory(ObViewComponent);