import React from 'react';
import {TableColumn} from "../../types";

export interface TableColumnsProps {
    columns: TableColumn[];
    primaryKeys: string[];
}
const TableColumns = ({columns, primaryKeys}:TableColumnsProps) => {

    return (
        <div className="table-responsive">
            <h4>Columns</h4>
            <table className="table table-xs">
                <thead>
                <tr><th>Key</th><th>Field</th><th>Type</th></tr>
                </thead>
                <tbody>
                {columns.map(field => (
                    <tr key={field.COLUMN_NAME}>
                        <td>{primaryKeys.includes(field.COLUMN_NAME) && (<span className="bi-key-fill"/>)}</td>
                        <td className="font-monospace">{field.COLUMN_NAME}</td>
                        <td className="font-monospace">
                            {field.TYPE_NAME}
                            {(['VARCHAR', 'LONGVARCHAR', 'CHAR'].includes(field.TYPE_NAME)) && (
                                <span>({field.COLUMN_SIZE})</span>
                            )}
                            {field.TYPE_NAME === 'DECIMAL' && (
                                <span>({field.NUM_PREC_RADIX}, {field.DECIMAL_DIGITS})</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
export default TableColumns;
