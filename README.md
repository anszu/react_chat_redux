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

This fork is using Redux for sharing states while the original repository is using the React Context directly. 

Shared states for this chat system are `channelId` and `userName` which are used by several components and also have to be changed by them.

![Concept](https://github.com/anszu/react_chat/blob/master/screenshots/shared_state.png)
