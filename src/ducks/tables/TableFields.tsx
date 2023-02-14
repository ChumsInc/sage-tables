import React from "react";
import {TableResponse} from "../../types";
import IndexRow from "./IndexRow";


const TableFields = ({columns}: Pick<TableResponse, 'columns'>) => {
    return (
        <div className="mb-3">
            <h4>Fields <small>(for MASDataTransferImplementation.php)</small></h4>
            <code>
                [{columns.map(field => field.COLUMN_NAME).join(', ')}]
            </code>
        </div>
    )
}

export default TableFields;
