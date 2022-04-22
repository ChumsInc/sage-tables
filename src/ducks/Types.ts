export type FieldType = 'VARCHAR'|'DATE'|'INTEGER'|'DECIMAL';

export interface Field {
    Name: string,
    FieldType: FieldType,
}

export interface FieldColumn {
    TABLE_CAT: string|null,
    TABLE_SCHEM: string|null,
    TABLE_NAME: string,
    COLUMN_NAME: string,
    DATA_TYPE: string,
    TYPE_NAME: string,
    COLUMN_SIZE: number,
    BUFFER_LENGTH: number,
    DECIMAL_DIGITS: number,
    NUM_PREC_RADIX: number|null,
    NULLABLE: boolean,
    REMARKS: null,
    COLUMN_DEF: "",
    SQL_DATA_TYPE: string,
    SQL_DATETIME_SUB: null,
    CHAR_OCTET_LENGTH: string|number,
    ORDINAL_POSITION: string|number,
    IS_NULLABLE: "YES"|"NO"
}

export interface TableIndex {
    unique: boolean,
    fields: string[],
    filter: null|string,

}
