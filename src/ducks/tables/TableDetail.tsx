import {useAppSelector} from "@/app/configureStore.ts";
import {selectServer, selectTable} from "./tablesSlice";
import TableColumns from "./TableColumns";
import TableIndexes from "./TableIndexes";
import TableFields from "./TableFields";
import CreateTable from "./CreateTable";
import {ProgressBar} from "react-bootstrap";

export interface TableDetailProps {
    tabKey: string;
}

const TableDetail = ({tabKey}: TableDetailProps) => {
    const table = useAppSelector((state) => selectTable(state, tabKey));
    const server = useAppSelector(selectServer);

    if (!table) {
        return null;
    }

    return (
        <div className="table-detail">
            <h3>{server.toUpperCase()} - {tabKey}</h3>
            {table.loading && (<ProgressBar now={100} striped animated/>)}
            <div className="row g-3">
                <div className="col-sm-6 col-md-3">
                    <TableColumns columns={table.columns} primaryKeys={table.primary_keys}/>
                </div>
                <div className="col">
                    <TableIndexes indexes={table.indexes}/>
                    <TableFields columns={table.columns} tableName={table.tableName}/>
                    <CreateTable table={tabKey} columns={table.columns} primaryKeys={table.primary_keys}
                                 indexes={table.indexes}/>
                </div>
            </div>
        </div>
    )
}

export default TableDetail;
