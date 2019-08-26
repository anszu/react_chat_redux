import React from 'react';

import Channels from './Channels';
import Chat from './Chat';

import './App.scss';

const App = () => {
    // call subcomponents with context provider
    return (
        <div className="App">
            <Channels/>
            <Chat/>
        </div>
    );
};

export default App;
