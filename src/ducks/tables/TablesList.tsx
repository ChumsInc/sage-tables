import React, {useState, MouseEvent} from 'react';
import {useSelector} from "react-redux";
import {loadTable, selectCompany, selectFilteredTablesList} from "./index";
import {useAppDispatch} from "../../app/configureStore";
import {addQuery} from "../queries";
import {emptyQuery, getQueryKey} from "../../utils";
import {TablePagination} from "chums-components";


const TablesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectFilteredTablesList);
    const company = useSelector(selectCompany);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25);


    const onClickTableInfo = (table:string) => {
        dispatch(loadTable(table));
    }

    const onClickTable = async (ev:MouseEvent<HTMLTableCellElement>) => {
        if (ev.ctrlKey && ev.altKey) {
            const sql = `SELECT * FROM ${ev.currentTarget.innerText}`;
            dispatch(addQuery({...emptyQuery(company), key: getQueryKey(), sql}))
        } else if (ev.ctrlKey) {
            await window.navigator.clipboard.writeText(ev.currentTarget.innerText);
        }
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
                            <td className="font-monospace db-table" onClick={onClickTable}>{table}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TablesList;
