import React, {ChangeEvent, useEffect} from 'react';
import {useSelector} from "react-redux";

import {SpinnerButton} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {loadTables, setCompany, setFilter, setServer} from "./actions";
import {selectCompany, selectFilter, selectLoading, selectServer,} from './selectors'
import {CompanyCode, ServerName} from "../../types";
import {Button, LinearProgress} from "@mui/material";

const TablesFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const server = useSelector(selectServer);
    const company = useSelector(selectCompany);
    const filter = useSelector(selectFilter);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(loadTables());
    }, []);

    useEffect(() => {
        dispatch(loadTables())
    }, [server, company])

    const handleServerChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setServer(ev.target.value as ServerName));
    }

    const handleCompanyChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCompany(ev.target.value as CompanyCode));
    }

    const onReload = () => {
        dispatch(loadTables())
    }

    const handleFilterChange = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilter(ev.target.value));
    }
    return (
        <div>
            <div className="input-group input-group-sm">
                <select className="form-select form-select-sm" value={server} onChange={handleServerChange}>
                    <option value="arches">ARCHES</option>
                    <option value="bryce">BRYCE</option>
                </select>
                <select className="form-select form-select-sm" value={company} onChange={handleCompanyChange}>
                    <option value="CHI">CHI</option>
                    <option value="TST">TST</option>
                    <option value="BCS">BCS</option>
                    <option value="SUH">SUH</option>
                    <option value="CAL">CAL</option>
                </select>
                <button type="button" className="btn btn-sm btn-primary" onClick={onReload}>Reload</button>
            </div>
            {loading && <LinearProgress variant="indeterminate" />}
            <div className="mt-1">
                <div className="input-group input-group-sm">
                    <div className="input-group-text"><span className="bi-funnel-fill"/></div>
                    <input type="search" className="form-control form-control-sm"
                           value={filter} onChange={handleFilterChange} placeholder="Filter"/>
                </div>
            </div>
        </div>
    )
}

export default TablesFilter;
