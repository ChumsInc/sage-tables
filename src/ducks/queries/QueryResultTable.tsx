import {
    DataTableRowCellSet,
    DataTableTR,
    SortableTableTH,
    Table,
    useTableFields,
    useTableSort
} from "@chumsinc/sortable-tables";
import styled from "@emotion/styled";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentQuerySortedData, updateQuery} from "@/ducks/queries/queriesSlice.ts";
import {useState} from "react";
import type {SortProps} from "chums-types";
import type {DataRow} from "@/src/types.ts";
import {type TableComponents, TableVirtuoso} from "react-virtuoso";
import classNames from "classnames";

const TableContainer = styled.div`
    height: calc(100vh - 100px);
    max-height: calc(100vh - 100px);
    width: 100%;
    transition: height 0.25s ease-in-out;

    .table {
        font-family: var(--bs-font-monospace), monospace;
        white-space: nowrap;
        //height: 70vh;

        thead {
            tr:nth-of-type(1) th,
            tr:nth-of-type(1) td {
                background-color: var(--bs-table-bg);
                border-bottom-width: 1px;
            }
        }

        tbody {
            td {
                height: calc(var(--bs-body-line-height) * 1.2);
            }

            td.text-date {
                color: #198844;
            }

            td.text-decimal {
                color: #F96A38;
            }
        }
    }
`

export interface QueryResultTableProps {
    queryKey: string;
}

export default function QueryResultTable({queryKey}: QueryResultTableProps) {
    const headerHeight = 25;
    const rowHeight = 25;
    const maxHeight = 700;
    const dispatch = useAppDispatch();
    const [fields] = useTableFields<DataRow>()
    const [sort, setSort] = useTableSort<DataRow>()
    const data = useAppSelector(selectCurrentQuerySortedData);
    const [selected, setSelected] = useState<number | null>(null);
    const [tableHeight, setTableHeight] = useState<number>(maxHeight);

    const sortChangeHandler = (_sort: SortProps<DataRow>) => {
        setSort(_sort);
        dispatch(updateQuery({key: queryKey, changes: {sort: _sort}}));
    }

    // Calculate height based on rows or max limit
    const handleTotalHeightChange = (totalHeight: number) => {
        const calculatedHeight = totalHeight + headerHeight;
        setTableHeight(Math.min(calculatedHeight, maxHeight));
    };


    const components: TableComponents<DataRow> = {
        Table: ({children, style}) => (
            <Table style={style} className="table table-xs table-hover table-list">{children}</Table>
        ),
        TableRow: ({children, item, ...rest}) => (
            <DataTableTR row={item} selected={item._id === selected} onClick={() => setSelected(item._id)} {...rest}>
                {children}
            </DataTableTR>
        ),
    }
    return (
        <TableContainer className="table-responsive" style={{height: tableHeight}}>
            <TableVirtuoso data={data}
                           components={components}
                           totalListHeightChanged={handleTotalHeightChange}
                           fixedItemHeight={rowHeight}
                           fixedHeaderContent={() => (
                               <tr>
                                   {fields
                                       .map((tableField, index) => (
                                           <SortableTableTH key={index} field={tableField}
                                                            sorted={sort?.field === tableField.field}
                                                            ascending={sort?.ascending}
                                                            className={classNames({[`text-${tableField.align}`]: !!tableField.align})}
                                                            onClick={sortChangeHandler}/>
                                       ))}
                               </tr>
                           )}
                           itemContent={(_index, row) => (
                               <DataTableRowCellSet fields={fields} row={row}/>
                           )}
            />
        </TableContainer>
    )
}
