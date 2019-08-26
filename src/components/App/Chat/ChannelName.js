import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useGetAPI from '../Hooks/useGetAPI';
import * as CONST from '../constants';

import './__styles__/ChannelName.scss';

const ChannelName = ({ channelId }) => {
    // call get hook
    const { values } = useGetAPI(`${CONST.API_PARAM_CHANNELS}/${channelId}`);

    // display chat name and topic
    return (
        <div className="ChannelName">
            { values &&
                <>
                    <span className="ChannelNameTitle">{values.name}</span>
                    <span className="ChannelNameTopic">{values.topic}</span>
                </>
            }
        </div>
    );
};

// prop definitions
ChannelName.propTypes = {
    channelId: PropTypes.number
};

// redux map state to props
const mapStateToProps = state => {
    return { channelId: state.channelId };
};

export default connect(mapStateToProps)(ChannelName);
