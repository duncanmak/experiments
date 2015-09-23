import * as React from 'react';
import { Log, Step } from '../wrench-support';

const DOM = React.DOM;

export class Grid extends React.Component<any, any> {

    color(s) {
        if (s.status === 'success')
            return 'green';
        if (s.status === 'issues')
            return 'orange';
        if (s.status === 'failed')
            return 'red';
        else
            return 'black';
    }

    openInNewTab = (url) => {
        var win = window.open(url, '_blank');
        win.focus();
    }

    openLog = (s: Step) => {
        let url = s.files[`${s.step}.log`];
        console.log(s.step, url);
        this.openInNewTab(url);
    }

    renderStep = (item, k) => {
        return item.steps.map((s, i) => {
            let key = `${k}-${i}`;
            let fill = this.color(s);
            let height = 2;
            let width = this.props.cellWidth;
            let x = 10;
            let y = i * height;
            // let onClick = (evt) => console.log(s);

            return DOM.rect({ key, x, y, width, height, fill, onClick: (evt) => this.openLog(s) } as any)
        });
    }

    renderLabel = (item: Log) => {
        // return (<div>{ item.commit.substring(0, 8) }</div>);
        return (
            <a href='_blank' onClick={ (evt) => this.openInNewTab(item.url)}>
              {item.commit.substring(0, 8)}
            </a>
        );
    }

    renderCommit = (item: Log, key: number) => {
//               <!-- { DOM.svg(props, this.renderStep(item, key)) } -->
        let height = this.props.cellHeight + 10;
        let width  = this.props.cellWidth + 10;
        let props = {width, height, key} as any;
        return DOM.p({},
            this.renderLabel(item),
            DOM.svg(props, this.renderStep(item, key))
         );
    }

    render() {
        return (
            <div>
                { this.props.data.map(this.renderCommit) }
            </div>
        );
    }
}
