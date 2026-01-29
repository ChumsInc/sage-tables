import {ContainedSortableTable} from "@chumsinc/sortable-tables";
import styled from "@emotion/styled";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentQueryPagedData, updateQuery} from "@/ducks/queries/index.ts";
import {useState} from "react";
import type {SortProps} from "chums-types";
import type {DataRow} from "@/src/types.ts";

const TableContainer = styled.div`
    .table {
        font-family: var(--bs-font-monospace);
        white-space: nowrap;

        td.text-date {
            color: #198844;
        }

        td.text-decimal {
            color: #F96A38;
        }
    }
`

export interface QueryResultTableProps {
    queryKey: string;
}
export default function QueryResultTable({queryKey}:QueryResultTableProps) {
    const dispatch = useAppDispatch();
    const data = useAppSelector(selectCurrentQueryPagedData);
    const [selected, setSelected] = useState<number | null>(null);
    const sortChangeHandler = (sort: SortProps<DataRow>) => {
        dispatch(updateQuery({key: queryKey, sort}));
    }

    return (
        <TableContainer className="table-responsive">
            <ContainedSortableTable data={data} size="xs"
                                    className="table-hover table-bordered"
                                    onSelectRow={(row) => setSelected(row._id)}
                                    selected={(row) => row._id === selected}
                                    keyField="_id" onChangeSort={sortChangeHandler}  >

            </ContainedSortableTable>
        </TableContainer>
    )
}
