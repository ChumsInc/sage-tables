import React, {ChangeEvent, useEffect, useRef, KeyboardEvent} from 'react';
import {executeQuery, selectQuery, updateQuery} from "./index";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import CompanySelect from "./CompanySelect";
import {CompanyCode, Query} from "../../types";
import {TextareaAutosize} from "@mui/base";
import {SpinnerButton} from "chums-components";


const QueryEditor = ({queryKey}: { queryKey: string }) => {
    const dispatch = useAppDispatch();
    const query = useAppSelector(state => selectQuery(state, queryKey));


    const queryChangeHandler = (field: keyof Pick<Query, 'company'|'limit'|'offset'|'sql'>) =>
        (ev: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'limit':
        case 'offset':
            dispatch(updateQuery({key: queryKey, [field]: +ev.target.value}));
            return
        case 'company':
            dispatch(updateQuery({key: queryKey, [field]: ev.target.value as CompanyCode}));
            return;
        case 'sql':
            dispatch(updateQuery({key: queryKey, [field]: ev.target.value}));
        }
    }

    const keyHandler = (ev:KeyboardEvent) => {
        if (ev.ctrlKey && (ev.code === 'Enter' || ev.code === 'NumpadEnter')) {
            dispatch(executeQuery(query));
        }
    }

    const submitHandler = () => {
        dispatch(executeQuery(query));
    }

    return (
        <div>
            <div className="row g-3 mb-1">
                <div className="col-auto">
                    <CompanySelect value={query.company} onChange={queryChangeHandler('company')}/>
                </div>
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">
                            Offset
                        </div>
                        <input type="number" value={query.offset} onChange={queryChangeHandler('offset')}
                               min={0} step={query.limit}
                               className="form-control form-control-sm"/>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">
                            Limit
                        </div>
                        <input type="number" value={query.limit} onChange={queryChangeHandler('limit')}
                               className="form-control form-control-sm"/>
                    </div>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" size="sm" color="primary"
                                   spinning={query.status === 'pending'}
                                   onClick={submitHandler}>
                        Submit
                    </SpinnerButton>
                </div>
            </div>
            <TextareaAutosize value={query.sql} onChange={queryChangeHandler('sql')} spellCheck={false}
                              disabled={query.status === 'pending'}
                              onKeyDown={keyHandler}
                              className="form-control form-control-sm font-monospace" minRows={3} maxRows={10} />
        </div>
    )
}


export default QueryEditor;
