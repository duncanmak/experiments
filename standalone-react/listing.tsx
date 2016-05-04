import * as React from 'react';

class Listing extends React.Component<any, any> {
    render() {
        let content = this.props.data.map(i => <li>{i}</li>);
        return <ol>{content}</ol>;
    }
}