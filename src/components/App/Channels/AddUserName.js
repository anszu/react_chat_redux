import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectUserName } from '../../../actions';
import usePostAPI from '../Hooks/usePostAPI';
import * as CONST from '../constants';

import './__styles__/AddUserName.scss';

const AddUserName = ({ userName, selectUserName }) => {
    const {
        values,
        handleChange,
        handleClick
    } = usePostAPI('', { creator: userName });

    const handleSubmit = (event) => {
        event.preventDefault();
        selectUserName(values.creator);
    };

    // render form
    return (
        <div className="AddUserName">
            {CONST.CHANGE_USERNAME}
            <form className="AddUserNameForm" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="creator"
                    value={values.creator}
                    className="AddUserNameInput form-control"
                    onChange={handleChange}
                    onClick={handleClick}
                />
                <button type="submit"
                    className="AddUserNameButton btn btn-light"
                    disabled={values.creator.trim() === ''}>
                    >
                </button>
            </form>
        </div>
    );
};

// prop definitions
AddUserName.propTypes = {
    userName: PropTypes.string,
    selectUserName: PropTypes.func
};

// redux state to props
const mapStateToProps = state => {
    return ({
        userName: state.userName
    });
};

export default connect(mapStateToProps, { selectUserName })(AddUserName);
