import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectFilteredTablesList, selectTablesLength, tableId} from "./index";
import {addPageSetAction, PaginationDuck, RowsPerPageDuck} from "chums-ducks";

const TablesList:React.FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(selectFilteredTablesList);
    const tablesLength = useSelector(selectTablesLength);
    useEffect(() => {
        dispatch(addPageSetAction({key: tableId}));
    }, [])

    return (
        <div>
            <table className="table table-xs table-hover">
                <thead>
                <tr><th>Table</th></tr>
                </thead>
                <tbody>
                {list.map(table => <tr key={table}><td>{table}</td></tr>)}
                </tbody>
            </table>
            <div className="mb-1"><RowsPerPageDuck pageKey={tableId}/></div>
            <PaginationDuck pageKey={tableId} dataLength={tablesLength} />
        </div>
    )
}

export default TablesList;
