import React, { useState, useEffect } from 'react';
import * as CONST from '../constants';

const useAPI = (APIItem = '', APIParam = '', RefreshTime = false) => {
    const [values, setValues] = useState();
    let interval = false;

    const callAPI = () => {
        fetch(`${CONST.API_GET_URL}/${APIParam}`, {
            headers: CONST.API_TOKEN
        })
            .then(res => res.json())
            .then((data) => {
                if (data._embedded && APIItem) {
                    setValues({ data: data._embedded[APIItem] });
                } else {
                    setValues(data);
                }
            });
    };

    useEffect(() => {
        callAPI();

        if (RefreshTime) {
            interval = setInterval(callAPI, RefreshTime);
        } else {
            callAPI();
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [APIParam]);

    return {
        values,
        callAPI
    };
};

export default useAPI;

