import React from 'react';
import {useAppSelector} from "../../app/configureStore";
import {selectLoading, selectServer, selectTable} from "./index";
import TableColumns from "./TableColumns";
import {LoadingProgressBar, ProgressBar} from "chums-components";
import IndexRow from "./IndexRow";
import TableIndexes from "./TableIndexes";
import TableFields from "./TableFields";
import CreateTable from "./CreateTable";

export interface TableDetailProps {
    tabKey: string;
}

const TableDetail = ({tabKey}: TableDetailProps) => {
    const table = useAppSelector((state) => selectTable(state, tabKey));
    const server = useAppSelector(selectServer);
    const loading = useAppSelector(selectLoading);
    if (!table) {
        return null;
    }

    return (
        <div className="table-detail">
            <h3>{server.toUpperCase()} - {tabKey}</h3>
            {table.loading && (<LoadingProgressBar striped animated/>)}
            <div className="row g-3">
                <div className="col-sm-6 col-md-3">
                    <TableColumns columns={table.columns} primaryKeys={table.primary_keys} />
                </div>
                <div className="col">
                    <TableIndexes indexes={table.indexes} />
                    <TableFields columns={table.columns}/>
                    <CreateTable table={tabKey} columns={table.columns} primaryKeys={table.primary_keys} />
                </div>
            </div>
        </div>
    )
}

export default TableDetail;
