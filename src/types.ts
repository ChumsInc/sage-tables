import {Editable} from "chums-types";
import {SortProps} from "chums-components";

export type ActionStatus = 'idle'|'pending'|'fulfilled'|'rejected';

export interface Query {
    key: string;
    company: CompanyCode;
    limit: number;
    offset: number;
    sql: string;
    timestamp: string|null;
    response: QueryResponse|null;
    dirty: boolean;
    status: ActionStatus;
    sort:SortProps<DataRow>;
    page: number;
    rowsPerPage: number;
    filename?: string;
    error?: string|null;
}

export type QueryChangeProps = Partial<Query> & Pick<Query, 'key'> ;
export type QueryPageProps = Pick<Query, 'key'|'page'>;
export type QueryRowsPerPageProps = Pick<Query, 'key'|'rowsPerPage'>;

export type SavedQuery = Pick<Query, 'company'|'sql'|'filename'>;

export type FieldType = 'VARCHAR'|'DECIMAL'|'DATE'|'LONGVARCHAR';

export interface QueryField {
    Name: string;
    FieldType: FieldType;
}

export interface DataRow {
    _id: number;
    [field:string]: string|number|null;
}

export interface QueryResponse {
    Company: string;
    Fields: QueryField[],
    Error: string|null;
    Data: DataRow[],
    Query: string;
    timings: {
        duration: number;
    }
}

export interface QueryList {
    [key:string]: Query & Editable;
}

export interface TableIndex {
    fields: string[];
    filter: unknown|null;
    unique: boolean;
}

export interface TableColumn {
    TABLE_CAT: null;
    TABLE_SCHEM: string|null;
    TABLE_NAME: string;
    COLUMN_NAME: string;
    DATA_TYPE: string;
    TYPE_NAME: FieldType,
    COLUMN_SIZE: number;
    BUFFER_LENGTH: number;
    DECIMAL_DIGITS: number;
    NUM_PREC_RADIX: number|null;
    NULLABLE: boolean;
    REMARKS: string|null;
    COLUMN_DEF: string;
    SQL_DATA_TYPE: string|number;
    SQL_DATETIME_SUB: number|null,
    CHAR_OCTET_LENGTH: string|number|null,
    ORDINAL_POSITION: number,
    IS_NULLABLE: 'YES'|'NO';
}

export interface RawIndex {
    TABLE_CAT: string;
    TABLE_SCHEM: string;
    TABLE_NAME: string;
    NON_UNIQUE: '0'|'1';
    INDEX_QUALIFIER: string;
    INDEX_NAME: string;
    TYPE: string;
    ORDINAL_POSITION: number;
    COLUMN_NAME: string;
    ASC_OR_DESC: 'A'|'D';
    CARDINALITY: null;
    PAGES: null;
    FILTER_CONDITION: null;
}

export interface IndexList {
    [key:string]: TableIndex;
}
export interface TableResponse {
    tableName: string;
    columns: TableColumn[],
    indexes: IndexList,
    primary_keys: string[];
    raw: RawIndex[];
    loading?: boolean;
}

export type TabType = 'query'|'table';

export interface TabList {
    [key:string]: TabType;
}

export type ServerName = 'ARCHES';
export type CompanyCode = 'CHI'|'TST';

export interface CompanyServer {
    server: ServerName;
    company: CompanyCode;
}

export interface DBTableSettings {
    SageCompanies: string[];
    SageTable: string;
    SageFields: string[];
    SageWhere: string;
    MysqlTable: string;
    MysqlFields: string[];
    PreExecute: string[];
    PostExecute: string[];
}
