import React from 'react';
import {useAppSelector} from "../../app/configureStore";
import {selectServer, selectTable} from "./selectors";
import TableColumns from "./TableColumns";
import {LoadingProgressBar} from "chums-components";
import TableIndexes from "./TableIndexes";
import TableFields from "./TableFields";
import CreateTable from "./CreateTable";
import {LinearProgress} from "@mui/material";

export interface TableDetailProps {
    tabKey: string;
}

const TableDetail = ({tabKey}: TableDetailProps) => {
    const table = useAppSelector((state) => selectTable(state, tabKey));
    const server = useAppSelector(selectServer);

    if (!table) {
        return null;
    }

    return (
        <div className="table-detail">
            <h3>{server.toUpperCase()} - {tabKey}</h3>
            {table.loading && (<LinearProgress variant="indeterminate"/>)}
            <div className="row g-3">
                <div className="col-sm-6 col-md-3">
                    <TableColumns columns={table.columns} primaryKeys={table.primary_keys}/>
                </div>
                <div className="col">
                    <TableIndexes indexes={table.indexes}/>
                    <TableFields columns={table.columns} tableName={table.tableName}/>
                    <CreateTable table={tabKey} columns={table.columns} primaryKeys={table.primary_keys} indexes={table.indexes}/>
                </div>
            </div>
        </div>
    )
}

export default TableDetail;
