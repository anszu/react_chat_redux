import React from 'react';
import PropTypes from 'prop-types';

import './__styles__/ChannelItem.scss';

const ChannelItem = ({ item, channelId, handleClick }) => {
    // render channel item and AddUserName component that was provided as child prop
    return (
        <li id={item.id}
            className={
                `ChannelItem ${channelId === item.id ? 'ChannelItem--active' : ''}`
            }
            onClick={handleClick}>
            <div className="ChannelItemName">
                {item.name}
            </div>
            <span className="ChannelItemTopic">
                {item.topic}
            </span>
        </li>
    );
};

// prop definitions
ChannelItem.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    channelId: PropTypes.number,
    handleClick: PropTypes.func
};

export default ChannelItem;
