# Slack like chat system based on React

Fork of [react_chat](https://github.com/anszu/react_chat) to demonstrate differences between usage of [Redux](https://redux.js.org/) vs. [React Context](https://reactjs.org/docs/context.html). 

## Getting Started

1. Make sure Node.js and NPM are [installed](https://nodejs.org/en/download/) 
2. Make sure Git is [installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. Make sure a [json-server](https://github.com/typicode/json-server) is installed, to simulate a REST API
4. Clone Repo with ```git clone git@github.com:anszu/react_chat_redux.git```
5. Install packages with ```npm install```
6. Go to the root folder of this repository and run ```json-server --watch db.json``` to start the REST API
7. Run with ```npm run start```
8. If you want you can modify [constants.js](https://github.com/anszu/react_chat_redux/blob/master/src/constants.js) with alternative API settings if you would like to use a real API (see [here](https://github.com/anszu/react_chat#configuration)). If you are running the Json Server at another port than 3000, you also have to modify the settings.

## Configuration

[**constants.js**](https://github.com/anszu/react_chat_redux/blob/master/src/constants.js) holds global constants to define API related settings, wordings and refresh intervalls. It was prefilled to be used with a faked REST API. 
You can find the data for this API in [db.json](https://github.com/anszu/react_chat_redux/blob/master/db.json).

Please be aware there is an expected structure for the REST API when using the API Parameters. If your API doesn't match this structure you have to adapt the calling components.

```javascript
// API Settings
export const API_POST_URL = 'http://localhost:3000';
export const API_GET_URL = 'http://localhost:3000';
export const API_TOKEN = {};
export const API_HEADERS = {
    'Content-Type': 'application/json',
    ...API_TOKEN
};

// API Params
// expected format: API_PARAM_CHANNELS/ChannelId
export const API_PARAM_CHANNELS = 'channels';
// expected format: API_PARAM_CHANNELS/ChannelId/API_PARAM_MESSAGES
export const API_PARAM_MESSAGES = 'messages';

// Wordings
// new channel
export const NEW_CHANNEL_NAME_INPUT = 'Name';
export const NEW_CHANNEL_TOPIC_INPUT = 'Thema';
export const NEW_CHANNEL_SUCCESS = 'Angelegt!';
export const NEW_CHANNEL_ERROR = 'Fehler!';
export const NEW_CHANNEL_INPUT = 'Neuer Channel: ';

// username
export const DISPLAY_USERNAME = 'eingeloggt als ';
export const CHANGE_USERNAME = 'Usernamen ändern:';

// message input button
export const BUTTON_MESSAGE_INPUT = 'Absenden';

// refresh settings
export const REFRESH_CHANNELS = 10000;
export const REFRESH_MESSAGES = 1000;
```

An extented documenation can be found in the [react_chat Repo](https://github.com/anszu/react_chat).

## Redux vs. React Context

This fork is using Redux for sharing states while the [original repository](https://github.com/anszu/react_chat) is using the React Context directly. 

Shared states for this chat system are `channelId` and `userName` which are used by several components and also have to be changed by some of them. The functions that are called to change those states are called `selectChannel` and `selectUserName`.

![Concept](https://github.com/anszu/react_chat_redux/blob/master/screenshots/concept.png)

### Shared State/ Reducers
#### React Context

The [App](https://github.com/anszu/react_chat/blob/master/src/components/App/index.js) component is defining `channelId` and `userName` as State via the `useState` Hook with preset values.

```javascript
...
const App = () => {
    // define states
    const [channelId, setChannelId] = useState(1);
    const [userName, setUserName] = useState('guest');
    ...
}
```

#### Redux
In Redux `channelId` and `userName` will be defined as reducers in [src/reducers/index.js](https://github.com/anszu/react_chat_redux/blob/master/src/reducers/index.js) with the same presets. 
The `channelIdReducer` should update and return the `channelId` whenever the `CHANNEL_SELECTED` action is fired, while the `userNameReducer` updates and returns the `userName` if the `USERNAME_SELECTED` action was triggerd.

```javascript
import { combineReducers } from 'redux';

const channelIdReducer = (channelId = 1, action) => {
    if (action.type === 'CHANNEL_SELECTED') return action.payload;
    return channelId;
};

const userNameReducer = (userName = 'guest', action) => {
    if (action.type === 'USERNAME_SELECTED') return action.payload;
    return userName;
};

export default combineReducers({
    channelId: channelIdReducer,
    userName: userNameReducer
});
```

### Change Shared State/ Actions
#### React Context

The functions to change the shared state `channelId` and `userName` are also defined in the [App](https://github.com/anszu/react_chat/blob/master/src/components/App/index.js) component, both will trigger a change for each of those states.

```javascript
...
const App = () => {
    // define states
    const [channelId, setChannelId] = useState(1);
    const [userName, setUserName] = useState('guest');

    // reset state for channel id
    const selectChannel = (channelId) => {
        setChannelId(channelId);
    };

    // reset state for username
    const selectUserName = (userName) => {
        setUserName(userName);
    };
}
```

#### Redux
In Redux the functionality to change the shared state are defined as actions within [src/actions/index.js](https://github.com/anszu/react_chat_redux/blob/master/src/actions/index.js). Both functions will return an object consisting of a `type`that can be either `CHANNEL_SELECTED` or `USERNAME_SELECTED` and a `payload` that holds the new value that was passed to it.

```javascript
export const selectChannel = (channelId) => {
    return ({
        type: 'CHANNEL_SELECTED',
        payload: channelId
    });
};

export const selectUserName = (userName) => {
    return ({
        type: 'USERNAME_SELECTED',
        payload: userName
    });
};
```

### Provide shared state
#### React Context

A Context object and a Context Provider object are defined and exported in [AppContext.js](https://github.com/anszu/react_chat/blob/master/src/AppContext.js).  
_(A Consumer object is not needed here, as consumer components will use the `useContext` Hook, which requires the main Context object.)_ 

```javascript
// create context objects
export const AppContext = React.createContext({});
export const AppContextProvider = AppContext.Provider;
```

The [App](https://github.com/anszu/react_chat/blob/master/src/components/App/index.js) component is importing the `AppContextProvider` object and wraps it around its child components. This way `channelId` and `userName` as well as the functions to change them: `selectChannel` and `selectUserName` are passed down to the child components and can be used by them.  

```javascript
import { AppContextProvider } from '../../AppContext';

const App = () => {
    // define states
    const [channelId, setChannelId] = useState(1);
    const [userName, setUserName] = useState('guest');

    // reset state for channel id
    const selectChannel = (channelId) => {
        setChannelId(channelId);
    };

    // reset state for username
    const selectUserName = (userName) => {
        setUserName(userName);
    };

    // call subcomponents with context provider
    return (
        <div className="App">
            <AppContextProvider value={{
                channelId, userName, selectChannel, selectUserName }}>
                <Channels/>
                <Chat/>
            </AppContextProvider>
        </div>
    );
};
```

### Redux
Finally the [App](https://github.com/anszu/react_chat_redux/blob/master/src/components/App/index.js) component also gets involved in the Redux version. It imports `Provider` from `react-redux` and `createStore` from `redux` and the reducers that have been defined in [src/reducers/index.js](https://github.com/anszu/react_chat_redux/blob/master/src/reducers/index.js).
`Provider` will be wrapped around the child components and also sets a store with the defined reducers that can be used by them. 

```javascript
import { Provider } from 'react-redux';
import { createStore } from 'redux';
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
```

### Consume shared state
#### React Context

In this application the Context will be accessed via the [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) Hook that simply assigns it to a constant.

Here's a example from the [ChannelName](https://github.com/anszu/react_chat/blob/master/src/components/App/Chat/ChannelName.js) component:
```javascript
import { AppContext } from '../../../AppContext';

const ChannelName = () => {
    // get channel id from context
    const { channelId } = useContext(AppContext);
    ...
}
```




