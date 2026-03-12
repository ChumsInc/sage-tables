import {type ChangeEvent, useCallback, useState} from 'react';
import {executeQuery} from "./actions";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import CompanySelect from "./CompanySelect";
import type {Query} from "../../types";
import SaveQueryButton from "./SaveQueryButton";
import LoadQueryButton from "./LoadQueryButton";
import SQLEditor from "./SQLEditor";
import Button from "react-bootstrap/Button";
import {selectCurrentQuery} from "@/ducks/queries/index.ts";
import {selectCurrentSQL, updateSQL} from "@/ducks/queries/sqlSlice.ts";

export interface QueryEditorProps {
    queryKey: string;
}

export default function QueryEditor({queryKey}: QueryEditorProps) {
    const dispatch = useAppDispatch();
    const query = useAppSelector(selectCurrentQuery);
    const sql = useAppSelector(selectCurrentSQL);
    const [limit, setLimit] = useState<string>(query?.limit?.toString() ?? '100');
    const [offset, setOffset] = useState<string>(query?.offset.toString() ?? '0');
    const changed = query?.sql !== sql;

    const editorChangeHandler = useCallback((sql?: string) => {
        dispatch(updateSQL({key: queryKey, sql: sql ?? ''}))
    }, [dispatch, queryKey])

    const queryChangeHandler = (field: keyof Pick<Query, 'company' | 'limit' | 'offset' | 'sql'>) =>
        (ev: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
            switch (field) {
                case 'limit':
                    setLimit(ev.target.value);
                    return;
                case 'offset':
                    setOffset(ev.target.value);
                    return;
            }
        }

    const submitHandler = async () => {
        if (!query) {
            return
        }
        await dispatch(executeQuery({...query, sql, limit: +limit, offset: +offset}));
    }

    const editorSubmitHandler = async (sql: string) => {
        if (!query) {
            return;
        }
        await dispatch(executeQuery({...query, sql, limit: +limit, offset: +offset}));
    }

    if (!query) {
        return null;
    }

    return (
        <div key={queryKey}>
            <div className="row g-3 mb-1">
                <div className="col-auto">
                    <CompanySelect value={query?.company ?? 'CHI'} onChange={queryChangeHandler('company')}/>
                </div>
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">
                            Offset
                        </div>
                        <input type="number" value={offset} onChange={queryChangeHandler('offset')}
                               min={0}
                               className="form-control form-control-sm"/>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">
                            Limit
                        </div>
                        <input type="number" value={limit} onChange={queryChangeHandler('limit')}
                               className="form-control form-control-sm"/>
                    </div>
                </div>
                <div className="col-auto">
                    <Button type="button" size="sm" color="primary"
                            onClick={submitHandler}>
                        {query?.status === 'pending' && <span className="spinner-border spinner-border-sm me-1"/>}
                        Submit
                    </Button>
                </div>
                <div className="col-auto">
                    <SaveQueryButton changed={changed}/>
                </div>
                <div className="col-auto">
                    <LoadQueryButton queryKey={query.key} changed={changed}/>
                </div>
                <div className="col text-end">ID: {query.key}</div>
            </div>
            <SQLEditor queryKey={query.key} sql={sql ?? ''} onChange={editorChangeHandler}
                       onExecute={editorSubmitHandler} readonly={query?.status === 'pending'}/>
        </div>
    )
}
