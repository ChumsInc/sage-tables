import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {
    selectQueryPage,
    selectQueryRowsPerPage,
    selectQuerySort,
    selectSortedQueryResponse
} from "./selectors";
import QueryDuration from "./QueryDuration";
import {Alert, SortableTable, SortableTableField, TablePagination} from "chums-components";
import {DataRow, QueryField} from "../../types";
import classNames from "classnames";
import {SortProps} from "chums-types";
import {saveAs} from 'file-saver';
import {setQueryPage, setQueryRowsPerPage, setQuerySort} from "./actions";

const downloadTSVHandler = (queryKey: string, data: DataRow[]) => {
    const values = data.map(row => Object.values(row).join('\t')).join('\r\n');
    const file = new Blob([values]);
    saveAs(file, `query-${queryKey}.txt`);
}

const downloadJSONHandler = (queryKey: string, data: DataRow[]) => {
    const values = JSON.stringify(data, undefined, 2);
    const file = new Blob([values]);
    saveAs(file, `query-${queryKey}.json`);
}


const renderedField = ({field, row}: { field: QueryField, row: DataRow }) => {
    switch (field.FieldType) {
        case 'DATE':
            return row[field.Name] === null
                ? '∅'
                : row[field.Name];
        default:
            return row[field.Name] ?? '∅';
    }
}
const tableField = (field: QueryField): SortableTableField => {
    return {
        field: field.Name,
        title: <span title={field.FieldType}>{field.Name}</span>,
        sortable: true,
        className: (row) => classNames({
            'text-end': field.FieldType === 'DECIMAL',
            'text-wrap': field.FieldType === 'LONGVARCHAR',
            'text-muted': row[field.Name] === null,
            'text-center': row[field.Name] === null,
            'text-decimal': field.FieldType === 'DECIMAL',
            'text-date': field.FieldType === 'DATE',
            'text-varchar': field.FieldType === 'VARCHAR' || field.FieldType === 'LONGVARCHAR',
        }),
        render: (row) => renderedField({field, row}),
    }
}

export default function QueryResult({queryKey}: { queryKey: string }) {
    const dispatch = useAppDispatch();
    const response = useAppSelector(state => selectSortedQueryResponse(state, queryKey));
    const sort = useAppSelector(state => selectQuerySort(state, queryKey));
    const page = useAppSelector(state => selectQueryPage(state, queryKey));
    const rpp = useAppSelector(state => selectQueryRowsPerPage(state, queryKey));
    const [selected, setSelected] = useState<number|null>(null);

    const pageChangeHandler = (page: number) => {
        dispatch(setQueryPage({key: queryKey, page}));
    }

    const rowsPerPageChangeHandler = (rowsPerPage: number) => {
        dispatch(setQueryRowsPerPage({key: queryKey, rowsPerPage}));
    }

    const sortChangeHandler = (sort: SortProps<any>) => {
        dispatch(setQuerySort({key: queryKey, sort: sort as SortProps<DataRow>}));
    }

    const {Data, Error, Fields, timings} = response;

    return (
        <div className="query-results-container">
            <div className="my-1">
                <code>
                    <span>{JSON.stringify({rows: Data.length})}</span>
                </code>
                <span className="ms-3">
                    Duration: {!!timings && <QueryDuration duration={timings.duration}/>}
                </span>
                <button type="button" className="btn btn-sm btn-outline-secondary ms-3"
                        onClick={() => downloadTSVHandler(queryKey, response.Data)}
                        disabled={Data.length === 0}>
                    Download TSV
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary ms-3"
                        onClick={() => downloadJSONHandler(queryKey, response.Data)}
                        disabled={Data.length === 0}>
                    Download JSON
                </button>
            </div>

            <div className="table-responsive">
                <SortableTable fields={Fields.map(tableField)} data={Data.slice(page * rpp, page * rpp + rpp)} size="xs"
                               className="table-hover"
                               onSelectRow={(row) => setSelected(row._id)}
                               selected={(row) => row._id === selected}
                               currentSort={sort} keyField="_id" onChangeSort={sortChangeHandler}/>
            </div>
            {!!Error && (
                <Alert color="warning">{Error}</Alert>
            )}
            <TablePagination page={page} onChangePage={pageChangeHandler} bsSize="sm"
                             rowsPerPage={rpp} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             showFirst showLast
                             count={Data.length}/>
        </div>
    )
}
