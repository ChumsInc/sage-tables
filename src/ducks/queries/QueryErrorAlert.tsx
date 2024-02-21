import React from 'react';
import {useAppSelector} from "../../app/configureStore";
import {selectQueryResponseError} from "./selectors";
import {Alert} from "chums-components";

const QueryErrorAlert = ({queryKey}:{queryKey:string}) => {
    const error = useAppSelector((state) => selectQueryResponseError(state, queryKey));
    if (!error) {
        return null;
    }

    return (
        <Alert color="danger">{error}</Alert>
    )
}

export default QueryErrorAlert;
