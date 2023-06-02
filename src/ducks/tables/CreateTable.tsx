import React, {useRef, useState, MouseEvent} from 'react';
import {IndexList, TableColumn, TableIndex} from "../../types";
import ColumnDefinition from "./ColumnDefinition";
import Snackbar from "@mui/base/Snackbar";
import {Alert, FormCheck} from "chums-components";

export type SQLFormat = 'MySQL'|'DDL';
export interface CreateTableProps {
    table: string;
    columns: TableColumn[],
    primaryKeys: string[],
    indexes: IndexList,
}

const CreateTable = ({table, columns, primaryKeys, indexes}: CreateTableProps) => {
    const ref = useRef<HTMLElement | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [format, setFormat] = useState<SQLFormat>('MySQL');

    const clickHandler = () => {
        if (ref.current) {
            const sql = ref.current?.innerText ?? '';
            navigator.clipboard.writeText(sql)
                .then(() => {
                    setMessage('SQL copied to clipboard.');
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
            <div className="d-flex align-items-baseline">
                <h4 onClick={clickHandler} style={{cursor: 'pointer'}}>
                    Create Table
                </h4>
                <div className="ms-3">
                    <FormCheck type="radio" checked={format === 'MySQL'} inline onChange={() => setFormat('MySQL')}>MySQL</FormCheck>
                    <FormCheck type="radio" checked={format === 'DDL'} inline onChange={() => setFormat('DDL')}>DDL</FormCheck>
                </div>
                <div className="ms-3">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clickHandler}>Copy Definition</button>
                </div>
            </div>
            <Snackbar open={!!message} onClose={() => setMessage(null)}
                              autoHideDuration={5000}>
                <Alert color="info" canDismiss onDismiss={() => setMessage(null)}>Content copied to clipboard.</Alert>
            </Snackbar>
            <code className="db-create-table" ref={ref}>
                CREATE TABLE {format === 'MySQL' && 'IF NOT EXISTS c2.'}{table} (
                {format === 'MySQL' && <ColumnDefinition colName="Company" colType="VARCHAR" size={15} nullable={false}/>}
                {columns.map(c => (
                    <ColumnDefinition key={c.COLUMN_NAME}
                                      colName={c.COLUMN_NAME}
                                      colType={c.TYPE_NAME}
                                      size={c.COLUMN_SIZE}
                                      decimals={c.DECIMAL_DIGITS}
                                      nullable={!primaryKeys.includes(c.COLUMN_NAME)}
                    />)
                )}
                {format === 'MySQL' && <ColumnDefinition colName="timestamp" colType="timestamp" nullable={false}/>}
                {'\t'}PRIMARY KEY ({format === 'MySQL' && 'Company,'}{primaryKeys.map(col => '`' + col + '`').join(',')})
                {'\n'}
                );
                {format === 'DDL' && (
                    <div className="mt-2">
                        {Object.keys(indexes).map(key => (
                            <div>
                                CREATE INDEX {key} on {table} ({indexes[key].fields.join(', ')});
                            </div>
                        ))}
                    </div>
                )}
            </code>
        </div>
    )
};

export default CreateTable;
