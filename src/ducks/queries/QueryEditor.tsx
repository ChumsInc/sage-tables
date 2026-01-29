import {type ChangeEvent, useState} from 'react';
import {executeQuery} from "./actions";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import CompanySelect from "./CompanySelect";
import type {Query} from "../../types";
import SaveQueryButton from "./SaveQueryButton";
import LoadQueryButton from "./LoadQueryButton";
import SQLEditor from "./SQLEditor";
import Button from "react-bootstrap/Button";
import {selectCurrentQuery} from "@/ducks/queries/index.ts";

export interface QueryEditorProps {
    queryKey: string;
}
export default function QueryEditor({queryKey}:QueryEditorProps) {
    const dispatch = useAppDispatch();
    const query = useAppSelector(selectCurrentQuery);
    const [sql, setSql] = useState<string>(query?.sql ?? '');
    const [limit, setLimit] = useState<number>(query?.limit ?? 100);
    const [offset, setOffset] = useState<number>(query?.offset ?? 0);

    const queryChangeHandler = (field: keyof Pick<Query, 'company' | 'limit' | 'offset' | 'sql'>) =>
        (ev: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
            switch (field) {
                case 'limit':
                    setLimit(+ev.target.value);
                    return;
                case 'offset':
                    setOffset(+ev.target.value);
                    return;
                case 'sql':
                    setSql(ev.target.value);
            }
        }

    const submitHandler = async () => {
        if (!query) {
            return
        }
        await dispatch(executeQuery({...query, sql, limit, offset}));
    }

    const editorChangeHandler = async (sql?: string) => {
        setSql(sql ?? '');
    }

    const editorSubmitHandler = async (sql: string) => {
        if (!query) {
            return;
        }
        await dispatch(executeQuery({...query, sql, limit, offset}));
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
                        <input type="number" value={query?.offset ?? 0} onChange={queryChangeHandler('offset')}
                               min={0} step={query?.limit ?? 0}
                               className="form-control form-control-sm"/>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">
                            Limit
                        </div>
                        <input type="number" value={query?.limit ?? 100} onChange={queryChangeHandler('limit')}
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
                    <SaveQueryButton changed={query.sql !== sql}/>
                </div>
                <div className="col-auto">
                    <LoadQueryButton queryKey={query.key} changed={query.sql !== sql}/>
                </div>
                <div className="col text-end">ID: {query.key}</div>
            </div>
            <SQLEditor queryKey={query.key} sql={query?.sql ?? ''} onChange={editorChangeHandler}
                       onExecute={editorSubmitHandler} readonly={query?.status === 'pending'}/>
        </div>
    )
}
