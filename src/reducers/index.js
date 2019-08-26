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
