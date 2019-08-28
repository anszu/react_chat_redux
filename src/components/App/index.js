import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Channels from './Channels';
import Chat from './Chat';
import reducers from '../../reducers';

import './App.scss';

const App = () => {
    // call subcomponents with context provider
    return (
        <div className="App">
            <Provider store={createStore(reducers)}>
                <Channels/>
                <Chat/>
            </Provider>
        </div>
    );
};

export default App;
