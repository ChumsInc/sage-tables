import {DataTableProvider, type SortableTableField} from "@chumsinc/sortable-tables";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentQuery, selectCurrentQueryFields, selectCurrentQuerySort} from "@/ducks/queries/queriesSlice.ts";
import type {DataRow, QueryField} from "@/src/types.ts";
import classNames from "classnames";
import QueryResultTable from "@/ducks/queries/QueryResultTable.tsx";

export default function QueryResultContext() {
    const query = useAppSelector(selectCurrentQuery);
    const fields = useAppSelector(selectCurrentQueryFields);
    const sort = useAppSelector(selectCurrentQuerySort);

    if (!query) {
        return null;
    }
    return (
        <DataTableProvider initialFields={fields.map(tableField)} initialSort={sort} key={query.response?.timestamp ?? 'new'}>
            <QueryResultTable queryKey={query?.key ?? ''} />
        </DataTableProvider>
    )
}


function renderedField({field, row}: { field: QueryField, row: DataRow }) {
    switch (field.FieldType) {
        case 'DATE':
            return row[field.Name] === null
                ? '∅'
                : row[field.Name];
        default:
            return row[field.Name] ?? '∅';
    }
}

function tableFieldAlign(field: QueryField): 'start' | 'end' | 'center' {
    switch (field.FieldType) {
        case 'DECIMAL':
            return 'end';
        default:
            return 'start';
    }
}

function tableField(field: QueryField): SortableTableField<DataRow> {
    return {
        field: field.Name,
        title: <span title={field.FieldType}>{field.Name}</span>,
        sortable: true,
        align: tableFieldAlign(field),
        className: (row) => classNames({
            'text-wrap': field.FieldType === 'LONGVARCHAR',
            'text-secondary': row[field.Name] === null,
            // 'text-center': row[field.Name] === null,
            'text-decimal': field.FieldType === 'DECIMAL',
            'text-date': field.FieldType === 'DATE',
            'text-varchar': field.FieldType === 'VARCHAR' || field.FieldType === 'LONGVARCHAR',
        }),
        render: (row) => renderedField({field, row}),
    }
}
