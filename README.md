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

An extented documenation can be found in the [react_chat Repo](https://github.com/anszu/react_chat).

## Redux vs. React Context

This fork is using Redux for sharing states while the [original repository](https://github.com/anszu/react_chat) is using the React Context directly. 

Shared states for this chat system are `channelId` and `userName` which are used by several components and also have to be changed by some of them. The functions that are called to change those states are `selectChannel` and `selectUserName`.

![Concept](https://github.com/anszu/react_chat_redux/blob/master/screenshots/concept.png)

### Shared State/ reducers
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

### Change Shared State/ actions
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

### Consume shared state/ reducers
#### React Context

In this application the Context will be accessed via the [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) Hook that simply assigns it to a constant.

Here's an example from the [ChannelName](https://github.com/anszu/react_chat/blob/master/src/components/App/Chat/ChannelName.js) component:
```javascript
import { AppContext } from '../../../AppContext';

const ChannelName = () => {
    // get channel id from context
    const { channelId } = useContext(AppContext);
    ...
}
```

#### Redux
With Redux shared state gets accessed by connecting the component to the store via the `connect` functionality. By also passing a `mapStateToProps` function to connect, the shared state can be used as a prop within the component.

Usage within the [ChannelName](https://github.com/anszu/react_chat_redux/blob/master/src/components/App/Chat/ChannelName.js) component:

```javascript
import { connect } from 'react-redux';

const ChannelName = ({ channelId }) => {
    ...
};

// redux map state to props
const mapStateToProps = state => {
    return { channelId: state.channelId };
};

export default connect(mapStateToProps)(ChannelName);
```
### Change shared state/ perform actions
#### React Context

As mentioned [here](https://github.com/anszu/react_chat_redux#react-context-1) the functions to changes `channelId`or `userName` are also stored in React Context and passed on to the child components via the `AppContextProvider`. Thi way the can be invoked by using the `useContect` Hook as well, similar to the shared state.

Usage within the [AddUserName](https://github.com/anszu/react_chat/blob/master/src/components/App/Channels/AddUserName.js) component:

```javascript
import { AppContext } from '../../../AppContext';

const AddUserName = () => {
    // get channel id, username and changechannelinfo function from context
    const { userName, selectUserName } = useContext(AppContext);

    ...
    
    // new username was submitted
    const handleSubmit = () => {
        event.preventDefault();
        selectUserName(values.creator);
    };
    
    ...
}
```

#### Redux
The functionality to change state has to be imported by importing [src/actions/index.js](https://github.com/anszu/react_chat_redux/blob/master/src/actions/index.js) first. Besides a `mapStateToProps` function, the action that should be called also has to be passed to the `connect` function and can be used within the component afterwads.

Example [AddUserName](https://github.com/anszu/react_chat_redux/blob/master/src/components/App/Channels/AddUserName.js) component:

```javascript
import { connect } from 'react-redux';
import { selectUserName } from '../../../actions';

const AddUserName = ({ userName, selectUserName }) => {
   
    const handleSubmit = (event) => {
        event.preventDefault();
        selectUserName(values.creator);
    };
    
    ...
};

// redux state to props
const mapStateToProps = state => {
    return ({
        userName: state.userName
    });
};

export default connect(mapStateToProps, { selectUserName })(AddUserName);
```

### Conclusion

React Context is pretty easy to implement and doesn't require a lot of coding, while Redux and the conventions around it, require folders for reducers and actions as well as the usage of an external libary that has to be imported.
This is not a very large project and requires just two values and it's modifier functions to be made accessible within different components.
Under those circumstances it's fine to define all that's needed directly in the main component and pass it further down via React Context. But it also become's obvious that things might get out of hand quickly if the project scales and new conventions regarding what's in the store and where to define it have to be made up.
This is already solved in Redux with it's commonly known conventions in place.

As quoted by [Sebastian Markbage](https://www.academind.com/learn/react/redux-vs-context-api/#will-react-s-context-api-replace-redux) (React Team) React Context (currently) is not built for high-frequency updates.

> My personal summary is that new context is ready to be used for low frequency unlikely updates (like locale/theme). It’s also good to use it in the same way as old context was used. I.e. for static values and then propagate updates through subscriptions. It’s not ready to be used as a replacement for all Flux-like state propagation. --- Sebastian Markbage

There are a lot of other interesting articles on this topic like [this](https://frontarm.com/james-k-nelson/when-context-replaces-redux/) or [this one](https://blog.softwaremill.com/react-context-api-vs-redux-the-eternal-dichotomy-24639907fc98).


