import {SortProps} from "chums-components";
import {DataRow} from "../../types";

export const dataSorter = (sort:SortProps<DataRow>) => (a:DataRow, b:DataRow) => {
    const aVal = a[sort.field as string] ?? '';
    const bVal = b[sort.field as string] ?? '';
    return (aVal === bVal
            ? (a._id > b._id ? 1 : -1)
            : (aVal > bVal ? 1 : -1)
    ) * (sort.ascending ? 1 : -1)
}
