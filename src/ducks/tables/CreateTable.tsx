import React, {useRef, useState} from 'react';
import {TableColumn} from "../../types";
import ColumnDefinition from "./ColumnDefinition";
import {SnackbarUnstyled} from "@mui/base";
import {Alert} from "chums-components";


export interface CreateTableProps {
    table: string;
    columns: TableColumn[],
    primaryKeys: string[],
}

const CreateTable = ({table, columns, primaryKeys}: CreateTableProps) => {
    const ref = useRef<HTMLElement | null>(null);
    const [message, setMessage] = useState<string | null>(null);
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
            <h4 onClick={clickHandler} style={{cursor: 'pointer'}}>Create Table <small>(for MySQL)</small></h4>
            <SnackbarUnstyled open={!!message} onClose={() => setMessage(null)}
                              autoHideDuration={5000}>
                <Alert color="info" canDismiss onDismiss={() => setMessage(null)}>Content copied to clipboard.</Alert>
            </SnackbarUnstyled>
            <code className="db-create-table" ref={ref}>
                CREATE TABLE IF NOT EXISTS `c2`.`{table}` (
                <ColumnDefinition colName="Company" colType="VARCHAR" size={15} nullable={false}/>
                {columns.map(c => (
                    <ColumnDefinition key={c.COLUMN_NAME}
                                      colName={c.COLUMN_NAME}
                                      colType={c.TYPE_NAME}
                                      size={c.COLUMN_SIZE}
                                      decimals={c.DECIMAL_DIGITS}
                                      nullable={!primaryKeys.includes(c.COLUMN_NAME)}
                    />)
                )}
                <ColumnDefinition colName="timestamp" colType="timestamp" nullable={false}/>
                {'\t'}PRIMARY KEY (`Company`, {primaryKeys.map(col => '`' + col + '`').join(',')})
                {'\n'}
                )
            </code>
        </div>
    )
};

export default CreateTable;
