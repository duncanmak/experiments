import * as React from 'react';

export class App extends React.Component<any, any> {
    render() { return <TodoList />; }
}

interface State { todos: string[]; }

class TodoList extends React.Component<any, State> {

    constructor() {
        super();
        this.state = {
            todos: ['Buy milk', 'Watch TV']
        };
    }

    onChange = (evt) => {
        if (evt.keyCode == 13) {
            this.setState({ todos: this.state.todos.concat([evt.target.value]) });
            evt.target.value = "";
        }
    }

    render() {
        return (
            <div>
                <p>TODOS</p>
                <ul>{this.state.todos.map((todo, key) => <li key={key}>{todo}</li>)}</ul>
                <p><input onKeyDown={this.onChange}></input></p>
            </div>
        );
    }
}

React.render(
    <App />,
    document.getElementById('app'));