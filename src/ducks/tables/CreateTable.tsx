import React from 'react';
import {TableColumn} from "../../types";
import ColumnDefinition from "./ColumnDefinition";


export interface CreateTableProps {
    table: string;
    columns: TableColumn[],
    primaryKeys: string[],
}
const CreateTable = ({table, columns, primaryKeys}:CreateTableProps) => {
    return (
        <div className="mb-3">
            <h4>Create Table <small>(for MySQL)</small></h4>
            <code className="db-create-table">
                CREATE TABLE `c2`.`{table}` (
                <ColumnDefinition colName="Company" colType="VARCHAR" size={15} nullable={false}/>
                {columns.map(c => (
                    <ColumnDefinition key={c.COLUMN_NAME}
                                      colName={c.COLUMN_NAME}
                                      colType={c.TYPE_NAME}
                                      size={c.COLUMN_SIZE}
                                      decimals={c.DECIMAL_DIGITS}
                                      nullable={primaryKeys.includes(c.COLUMN_NAME) === false}
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
