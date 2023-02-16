import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectQuerySort, selectSortedQueryResponse, setQuerySort} from "./index";
import QueryDuration from "./QueryDuration";
import {SortableTable, SortableTableField, TablePagination} from "chums-components";
import {DataRow, QueryField} from "../../types";
import classNames from "classnames";
import {SortProps} from "chums-types";
import {saveAs} from 'file-saver';

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
        title: field.Name,
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
    const [page, setPage] = useState(0);
    const [rpp, setRpp] = useState(10);

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPage(0);
        setRpp(rpp);
    }

    const sortChangeHandler = (sort: SortProps<any>) => {
        setPage(0);
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
                               currentSort={sort} keyField="_id" onChangeSort={sortChangeHandler}/>
            </div>
            <TablePagination page={page} onChangePage={setPage} bsSize="sm"
                             rowsPerPage={rpp} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             showFirst showLast
                             count={Data.length}/>
        </div>
    )
}