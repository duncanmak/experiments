import * as React from 'react';
import { Log, Step } from '../wrench-support';

const DOM = React.DOM;

interface Props extends React.Props<any> {
    data?: Log[]; // optional because of usage in app.ts
}

export class List extends React.Component<Props, any> {
    renderLog(item: Log, key: number) {

        let renderSteps = (status: string) => {
            // return JSON.stringify(item.steps, null, 2); // .filter(s => s.status == status);
            let steps = item.steps
                .filter((s: Step) => s.status === status)
                .map((s: Step) => <div><a href={s.files[`${s.step}.log`]}> {s.step} </a></div>);

            if (steps.length === 0) {
                return (<div />)
            } else {
                return (
                    <p>
                    <b>{ status.toUpperCase() }({ steps.length })</b>
                    {steps }
                    </p>
                );
            }
        }

    return (
        <li key={ key } >
            <p><b>Commit:</b>{item.commit}</p>
            {renderSteps('success')}
            {renderSteps('issues')}
            {renderSteps('failed')}
        </li>
        );
    }

render() {
    let style: any = { style: { float: 'left' } };
    return DOM.ul(style, this.props.data.map(this.renderLog));
}
}
