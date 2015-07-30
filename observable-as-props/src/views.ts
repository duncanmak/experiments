import * as React from 'react';
import { createFactory, DOM } from 'react';

interface Props extends React.Props<any> {
    name: string;
    data?: number[]; // optional because of usage in app.ts
}

class ListComponent extends React.Component<Props, any> {

    render() {
        let time = () => {
            let d = new Date();
            return `${d.getSeconds() }s ${d.getMilliseconds() }ms`;
        };

        console.log(time(), 'render', this.props.name, this.props.data.length);

        return DOM.ul(
            { style: { float: 'left' } },
            DOM.div({}, this.props.name),
            this.props.data.map((v: number) => DOM.li({ key: v }, v)));
    }
}
export const List = createFactory(ListComponent);

class GridComponent extends React.Component<Props, any> {
    column = 50;
    width = 30;
    textpad = 5;

    box(i: number) {
        return DOM.g({ key: i },
            DOM.rect({
                x: i % this.column + (this.width * ~~(i % this.column)),
                y: i / this.column + (this.width * ~~(i / this.column)),
                width: this.width,
                height: this.width,
                fill: 'grey',
                opacity: 1
            }),
            DOM.text({
                x: i % this.column + (this.width * ~~(i % this.column)) + this.textpad,
                y: i / this.column + (this.width * ~~(i / this.column)) + this.textpad * 2,
                fill: "#ccc",
                dy: '0.7em',
                fontSize: "10px",
                fontFamily: "sans-serif"
            }, ("0000" + i).slice(-4)));
    }

    render() {
        let time = () => {
            let d = new Date();
            return `${d.getSeconds() }s ${d.getMilliseconds() }ms`;
        };

        console.log(time(), 'render', this.props.name, this.props.data.length);

        let style = {
            float: 'left',
            padding: '10px',
            margin: '0 auto',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'arial, sans-serif'
        }
        return DOM.div(
            { style },
            DOM.div({
                style: {
                    display: 'block',
                    backgroundColor: '#ccc',
                    marginBottom: '6px'
                }
            }, this.props.name),
            DOM.svg({
                height: this.width * this.column + this.column,
                width: this.width * this.column + this.column,
                style: { float: 'left' }
            },
                this.props.data.map((v: number) => this.box(v)//DOM.li({ key: v }, v)
        )));
    }
}
export const Grid = createFactory(GridComponent);
