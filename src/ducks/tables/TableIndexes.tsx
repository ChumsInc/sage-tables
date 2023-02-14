import React from "react";
import {TableResponse} from "../../types";
import IndexRow from "./IndexRow";


const TableIndexes = ({indexes}: Pick<TableResponse, 'indexes'>) => {
    return (
        <div className="mb-3">
            <h4>Indexes</h4>
            <table className="table table-xs">
                <thead>
                <tr>
                    <th>Key</th>
                    <th>Fields</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(indexes).map(key => (
                    <IndexRow key={key} name={key} fields={indexes[key]!.fields} unique={indexes[key]!.unique}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableIndexes;
