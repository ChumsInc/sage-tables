import React, {useRef, useState} from "react";
import {DBTableSettings, TableColumn, TableResponse} from "../../types";
import Snackbar from "@mui/material/Snackbar";
import {Alert} from "chums-components";

const dbCreateTable = (tableName: string, sageFields: TableColumn[]):DBTableSettings => {
    return {
        SageCompanies: ['CHI'],
        SageTable: tableName,
        SageFields: sageFields.map(field => field.COLUMN_NAME),
        SageWhere: '',
        MysqlTable: tableName,
        MysqlFields: [],
        PreExecute: [`DELETE FROM ${tableName} WHERE Company = '{COMPANY}'`],
        PostExecute: [],
    }
}

const TableFields = ({columns, tableName}: Pick<TableResponse, 'columns' | 'tableName'>) => {
    const ref = useRef<HTMLElement | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const clickHandler = () => {
        if (ref.current) {
            const sql = ref.current?.innerText ?? '';
            navigator.clipboard.writeText(sql)
                .then(() => {
                    setMessage('Fields copied to clipboard.');
                })
                .catch((err: unknown) => {
                    if (err instanceof Error) {
                        setMessage(err.message);
                    }
                })
        }
    }
    return (
        <div className="mb-3">
            <h4 onClick={clickHandler} style={{cursor: 'pointer'}}>Fields <small>(for
                MASDataTransferImplementation.php)</small></h4>
            <Snackbar open={!!message} onClose={() => setMessage(null)}
                              autoHideDuration={5000}>
                <div>
                    <Alert color="info" canDismiss onDismiss={() => setMessage(null)}>Content copied to clipboard.</Alert>
                </div>
            </Snackbar>
            <code ref={ref} className="db-create-table">
                {JSON.stringify(dbCreateTable(tableName, columns), undefined, 2)}
            </code>
        </div>
    )
}

export default TableFields;
