import React, {ChangeEvent, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    filterChangedAction,
    loadTablesAction, selectCompany,
    selectFilter,
    selectLoading,
    selectServer,
    serverChangedAction
} from "./index";
import {SpinnerButton} from "chums-ducks";

const TablesFilter:React.FC = () => {
    const dispatch = useDispatch();
    const server = useSelector(selectServer);
    const company = useSelector(selectCompany);
    const filter = useSelector(selectFilter);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(loadTablesAction());
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
