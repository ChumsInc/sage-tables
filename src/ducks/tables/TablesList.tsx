import {type MouseEvent, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCompany, selectFilteredTablesList, selectPage, selectRowsPerPage} from "./selectors";
import {loadTable, setPage} from "./actions";
import {useAppDispatch} from "../../app/configureStore";
import {emptyQuery, getQueryKey} from "../../utils";
import {TablePagination} from "@chumsinc/sortable-tables";
import {Toast, ToastContainer} from "react-bootstrap";
import {addQuery, selectCurrentQuery, updateQuery} from "@/ducks/queries";
import styled from "@emotion/styled";

const TablesTable = styled.table`
    .db-table {
        cursor: pointer;
    }
    
`

export default function TablesList() {
    const dispatch = useAppDispatch();
    const list = useSelector(selectFilteredTablesList);
    const company = useSelector(selectCompany);
    const currentQuery = useSelector(selectCurrentQuery);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const [copied, setCopied] = useState<string | null>(null);

    const pageChangeHandler = (page: number) => dispatch(setPage(page));

    const snackbarClosedHandler = () => setCopied(null);

    const onClickTableInfo = (table: string) => {
        dispatch(loadTable(table));
    }

    const onClickTable = (table: string) => async (ev: MouseEvent<HTMLTableCellElement>) => {
        if (ev.ctrlKey && ev.altKey) {
            return onAddQuery(table);
        }
        if (!ev.currentTarget || !ev.ctrlKey) {
            return;
        }
        await window.navigator.clipboard.writeText(table);
        setCopied(table);
    }

    const onAddQuery = (table: string) => {
        const sql = `SELECT *
                     FROM ${table}`;
        if (currentQuery && currentQuery.sql === '') {
            dispatch(updateQuery({key: currentQuery.key, sql}));
            return;
        }
        dispatch(addQuery({...emptyQuery(company), key: getQueryKey(), sql}))
    }

    return (
        <div>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             showFirst showLast
                             rowsPerPage={rowsPerPage}
                             className="table-list-pagination"
                             size="sm"
                             count={list.length}/>
            <TablesTable className="table table-xs mt-3">
                <thead>
                <tr>
                    <th><span className="bi-info-square"/></th>
                    <th>Table</th>
                    <th><span className="bi-database-fill-gear"/></th>
                </tr>
                </thead>
                <tbody>
                {list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(table => (
                        <tr key={table}>
                            <td>
                                <button className="btn btn-link p-0 text-info"
                                        style={{lineHeight: 'revert', fontSize: 'revert'}}
                                        onClick={() => onClickTableInfo(table)}>
                                    <span className="bi-info-square-fill"/>
                                </button>
                            </td>
                            <td className="font-monospace db-table" onClick={onClickTable(table)}>{table}</td>
                            <td className="db-table" onClick={() => onAddQuery(table)}>
                                <span className="bi-database-gear"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </TablesTable>
            <ToastContainer className="position-fixed bottom-0 start-0 p-3">
                <Toast show={!!copied} onClose={snackbarClosedHandler} autohide delay={5000} bg="info">
                    <Toast.Header closeButton={false} className="text-center">{copied}</Toast.Header>
                    <Toast.Body>Table name copied to clipboard.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}
