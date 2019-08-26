import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as CONST from '../constants';
import useGetAPI from '../Hooks/useGetAPI';

import './__styles__/Content.scss';

const Content = ({ channelId, children }) => {
    // call get hook
    const { values } = useGetAPI(`${CONST.API_PARAM_CHANNELS}/${channelId}/${CONST.API_PARAM_MESSAGES}`,
        CONST.REFRESH_MESSAGES);

    // call rendering prop function
    return (
        <div className="Content" id="Content">
            { values && children(values) }
        </div>
    );
};

// prop definitions
Content.propTypes = {
    channelId: PropTypes.number,
    children: PropTypes.func
};

const mapStateToProps = state => {
    return { channelId: state.channelId };
};

export default connect(mapStateToProps)(Content);
