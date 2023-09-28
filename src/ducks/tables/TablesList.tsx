import React, {useState, MouseEvent} from 'react';
import {useSelector} from "react-redux";
import {loadTable, selectCompany, selectFilteredTablesList} from "./index";
import {useAppDispatch} from "../../app/configureStore";
import {addQuery, selectCurrentQuery, updateQuery} from "../queries";
import {emptyQuery, getQueryKey} from "../../utils";
import {TablePagination} from "chums-components";
import Snackbar from "@mui/material/Snackbar";


const TablesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectFilteredTablesList);
    const company = useSelector(selectCompany);
    const currentQuery = useSelector(selectCurrentQuery);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [copied, setCopied] = useState<string|null>(null);


    const snackbarClosedHandler = () => setCopied(null);

    const onClickTableInfo = (table:string) => {
        dispatch(loadTable(table));
    }

    const onClickTable = (table:string) => async (ev:MouseEvent<HTMLTableCellElement>) => {
        if (ev.ctrlKey && ev.altKey) {
            return onAddQuery(table);
        }
        if (!ev.currentTarget || !ev.ctrlKey) {
            return;
        }
        await window.navigator.clipboard.writeText(table);
        setCopied(`${table} copied to clipboard`);
    }

    const onAddQuery = (table:string) => {
        const sql = `SELECT * FROM ${table}`;
        if (currentQuery && currentQuery.sql === '') {
            dispatch(updateQuery({key: currentQuery.key, sql}));
            return;
        }
        dispatch(addQuery({...emptyQuery(company), key: getQueryKey(), sql}))
    }

    return (
        <div className="db-tables-list-container">
            <TablePagination page={page} onChangePage={setPage}
                             showFirst showLast
                             rowsPerPage={rowsPerPage}
                             className="table-list-pagination"
                             bsSize="sm"
                             count={list.length}/>
            <table className="table table-xs mt-3 db-tables-list">
                <thead>
                <tr>
                    <th><span className="bi-info-square" /></th>
                    <th>Table</th>
                    <th><span className="bi-database-fill-gear" /></th>
                </tr>
                </thead>
                <tbody>
                {list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(table => (
                        <tr key={table}>
                            <td>
                                <button className="text-info db-table-info"
                                        onClick={() => onClickTableInfo(table)}>
                                    <span className="bi-info-square" />
                                </button>
                            </td>
                            <td className="font-monospace db-table" onClick={onClickTable(table)}>{table}</td>
                            <td className="db-table" onClick={() => onAddQuery(table)}><span className="bi-database-gear" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Snackbar open={!!copied} autoHideDuration={6000} onClose={snackbarClosedHandler} message={copied} />
        </div>
    )
}

export default TablesList;
