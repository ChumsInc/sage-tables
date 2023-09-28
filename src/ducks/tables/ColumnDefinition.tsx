import React from "react";
import {FieldType} from "../../types";


const mapColType = (colType: FieldType|'timestamp', size?:number, decimals?:number) => {
    switch (colType.toUpperCase()) {
    case 'VARCHAR':
        if (Number(size) > 256) {
            return 'TEXT';
        }
        return `varchar(${size})`;
    case 'LONGVARCHAR':
        return 'TEXT';
    case 'CHAR':
        if (Number(size) > 256) {
            return 'TEXT';
        }
        return `char(${size})`;
    case 'DECIMAL':
        return `decimal(${size},${decimals})`;
    case 'DATE':
        return 'date';
    default:
        return colType;
    }
};

export interface ColumnDefinitionProps {
    colName: string;
    colType: FieldType|'timestamp';
    size?: number;
    decimals?: number;
    nullable?: boolean;
}
const ColumnDefinition = ({colName, colType, size, decimals, nullable}:ColumnDefinitionProps) => {
    return (
        <div>{'\t'}{colName} {mapColType(colType, size, decimals)} {nullable ? 'DEFAULT NULL' : 'NOT NULL'},</div>
    )
}

export default ColumnDefinition;
