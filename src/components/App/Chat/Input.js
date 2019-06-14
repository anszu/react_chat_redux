import React, { useContext } from 'react';
import usePostAPI from '../Hooks/usePostAPI';
import { AppContext } from '../AppContext';
import './__styles__/Input.scss';

const Input = () => {
    // get channel id and username from context and call post hook
    const { ChannelId, UserName } = useContext(AppContext);
    const {
        values,
        handleChange,
        handleSubmit,
        updateValue
    } = usePostAPI({ content: '', creator: UserName }, `/channels/${ChannelId}/messages`);

    // update creator if necessary
    updateValue(UserName, 'creator');

    // display form
    return (
        <div className="Input">
            <form className="InputForm" onSubmit={handleSubmit}>
                <input className="form-control" name="content" value={values.content} onChange={handleChange}/>
                <button type="submit" className="InputButton btn btn-light">Absenden</button>
            </form>
        </div>
    );
};

export default Input;
