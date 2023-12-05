import React, {useRef, useState} from 'react';
import {IndexList, TableColumn} from "../../types";
import ColumnDefinition from "./ColumnDefinition";
import Snackbar from "@mui/material/Snackbar";
import {Alert, FormCheck} from "chums-components";

export type SQLFormat = 'MySQL' | 'DDL';

export interface CreateTableProps {
    table: string;
    columns: TableColumn[],
    primaryKeys: string[],
    indexes: IndexList,
}

const CreateTable = ({table, columns, primaryKeys, indexes}: CreateTableProps) => {
    const ref = useRef<HTMLElement | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [format, setFormat] = useState<SQLFormat>('MySQL');

    const clickHandler = async () => {
        if (ref.current) {
            const sql = ref.current?.innerText ?? '';
            try {
                await navigator.clipboard.writeText(sql)
                setMessage('SQL copied to clipboard');
                setOpen(true);
            } catch(err:unknown) {
                if (err instanceof Error) {
                    console.debug("clickHandler()", err.message);
                    setMessage(err.message);
                    setOpen(true);
                }
                console.debug("clickHandler()", err);
                return Promise.reject(new Error('Error in clickHandler()'));
            }
        }
    }

    const closeHandler = () => {
        setMessage(null);
        setOpen(false);
    }

    return (
        <div className="mb-3">
            <div className="d-flex align-items-baseline">
                <h4 onClick={clickHandler} style={{cursor: 'pointer'}}>
                    Create Table
                </h4>
                <div className="ms-3">
                    <FormCheck type="radio" checked={format === 'MySQL'} inline
                               onChange={() => setFormat('MySQL')}>MySQL</FormCheck>
                    <FormCheck type="radio" checked={format === 'DDL'} inline
                               onChange={() => setFormat('DDL')}>DDL</FormCheck>
                </div>
                <div className="ms-3">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clickHandler}>Copy
                        Definition
                    </button>
                </div>
            </div>
            <Snackbar open={open} onClose={closeHandler}
                      autoHideDuration={5000}>
                <div>
                    <Alert color="info" canDismiss onDismiss={closeHandler}>Content copied to clipboard.</Alert>
                </div>
            </Snackbar>
            <code className="db-create-table" ref={ref}>
                CREATE TABLE {format === 'MySQL' && 'IF NOT EXISTS c2.'}{table} (
                {format === 'MySQL' &&
                    <ColumnDefinition colName="Company" colType="VARCHAR" size={15} nullable={false}/>}
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
