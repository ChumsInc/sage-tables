import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import {executeQuery, updateQuery} from "./actions";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import CompanySelect from "./CompanySelect";
import {CompanyCode, Query} from "../../types";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {SpinnerButton} from "chums-components";
import {selectQuery} from "./selectors";
import SaveQueryButton from "./SaveQueryButton";
import LoadQueryButton from "./LoadQueryButton";
import SQLEditor from "./SQLEditor";


const QueryEditor = ({queryKey}: { queryKey: string }) => {
    const dispatch = useAppDispatch();
    const query = useAppSelector(state => selectQuery(state, queryKey));
    const [key, setKey] = useState<string>(queryKey);

    useEffect(() => {
        setKey(queryKey);
    }, [queryKey]);

    const queryChangeHandler = (field: keyof Pick<Query, 'company' | 'limit' | 'offset' | 'sql'>) =>
        (ev: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
            switch (field) {
                case 'limit':
                case 'offset':
                    dispatch(updateQuery({key, [field]: +ev.target.value}));
                    return
                case 'company':
                    dispatch(updateQuery({key, [field]: ev.target.value as CompanyCode}));
                    return;
            }
        }

    const submitHandler = async () => {
        await dispatch(executeQuery(key));
    }

    const editorChangeHandler = async (sql?:string) => {
        dispatch(updateQuery({key, sql}));
    }
    const editorSubmitHandler = async (sql:string, queryKey: string) => {
        console.log('editorSubmitHandler', queryKey, sql);
        dispatch(updateQuery({key: queryKey, sql}));
        await dispatch(executeQuery(queryKey))
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
                <div className="col-auto">
                    <SaveQueryButton queryKey={key}/>
                </div>
                <div className="col-auto">
                    <LoadQueryButton queryKey={key}/>
                </div>
                <div className="col">{key}</div>
            </div>
            <SQLEditor queryKey={queryKey} sql={query.sql} onChange={editorChangeHandler} onExecute={editorSubmitHandler} readonly={query.status === 'pending'} />
        </div>
    )
}


export default QueryEditor;
