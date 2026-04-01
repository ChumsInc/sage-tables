import {type MouseEvent, useState} from 'react';
import {useSelector} from "react-redux";
import {loadTable} from "./actions";
import {useAppDispatch} from "@/app/configureStore.ts";
import {emptyQuery, getQueryKey} from "../../utils";
import {Toast, ToastContainer} from "react-bootstrap";
import {addQuery, selectCurrentQuery, updateQuery} from "@/ducks/queries/queriesSlice.ts";
import styled from "@emotion/styled";
import {type TableComponents, TableVirtuoso} from "react-virtuoso";
import {selectCompany, selectFilteredTablesList} from "@/ducks/tables/tablesSlice.ts";


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
    const [copied, setCopied] = useState<string | null>(null);

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
        const sql = `SELECT * FROM ${table}`;
        if (currentQuery && currentQuery.sql === '') {
            dispatch(updateQuery({key: currentQuery.key, sql}));
            return;
        }
        dispatch(addQuery({...emptyQuery(company), key: getQueryKey(), sql}))
    }

    const components: TableComponents<string> = {
        Table: ({children, style}) => (
            <TablesTable style={style} className="table table-xs table-list">{children}</TablesTable>
        ),
    }

    return (
        <div style={{height: '70vh'}}>
            <TableVirtuoso data={list}
                           components={components}
                           fixedHeaderContent={() => (
                               <tr>
                                   <th><span className="bi-info-square"/></th>
                                   <th>Table</th>
                                   <th><span className="bi-database-fill-gear"/></th>
                               </tr>
                           )}
                           itemContent={(_index, table) => (
                               <>
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
                               </>
                           )}/>
            <ToastContainer className="position-fixed bottom-0 start-0 p-3">
                <Toast show={!!copied} onClose={snackbarClosedHandler} autohide delay={5000} bg="info">
                    <Toast.Header closeButton={false} className="text-center">{copied}</Toast.Header>
                    <Toast.Body>Table name copied to clipboard.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}
