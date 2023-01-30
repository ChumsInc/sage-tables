import React, {ChangeEvent, useEffect} from 'react';
import {useSelector} from "react-redux";

import {SpinnerButton} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {loadTables, selectCompany, selectFilter, selectLoading, selectServer} from "./index";

const TablesFilter:React.FC = () => {
    const dispatch = useAppDispatch();
    const server = useSelector(selectServer);
    const company = useSelector(selectCompany);
    const filter = useSelector(selectFilter);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(loadTables(company));
    }, [])

    const handleServerChange = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(serverChangedAction(ev.target.value));
        dispatch(loadTablesAction())
    }

    const handleCompanyChange = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(serverChangedAction(ev.target.value));
        dispatch(loadTablesAction())
    }

    const onReload = () => {
        dispatch(loadTablesAction())
    }

    const handleFilterChange = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(filterChangedAction(ev.target.value));
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
                <SpinnerButton type="button" color="primary" spinning={loading} onClick={onReload}>Reload</SpinnerButton>
            </div>
            <div>
                <input type="search" className="form-control form-control-sm" value={filter} onChange={handleFilterChange} />
            </div>
        </div>
    )
}

export default TablesFilter;
