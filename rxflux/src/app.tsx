import * as React from 'react';
import { entryRemoved, entryUpdated } from './actions';
import { partial } from 'lodash';

const Text = ({text}) => <textarea cols='100' rows='20' readOnly={true} value={text} />;
const Add = ({count}) => <p><button onClick={partial(entryUpdated, count)}>Add!</button></p>
const Entry = ({idx, text}) =>
    <p>
        <span> {idx + 1} </span>
        <input size='75' value={text} onChange={partial(entryUpdated, idx)}/>
        <button onClick={evt => entryRemoved(idx)}>x</button>
    </p>;

export const App = ({entries}) =>
    <div>
        {entries.map((e, i) => <Entry key={i} idx={i} text={e} />)}
        <p />
        <Add count={entries.length}/>
        <hr />
        <Text text={entries.join('\n\n') } />
    </div>
