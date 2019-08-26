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
