import {useRef, useState} from "react";
import type {DBTableSettings, TableColumn, TableResponse} from "../../types";
import {Toast, ToastContainer} from "react-bootstrap";

const dbCreateTable = (tableName: string, sageFields: TableColumn[]): DBTableSettings => {
    return {
        SageCompanies: ['CHI'],
        SageTable: tableName,
        SageFields: sageFields.map(field => field.COLUMN_NAME),
        SageWhere: '',
        MysqlTable: tableName,
        MysqlFields: [],
        PreExecute: [`DELETE
                      FROM ${tableName}
                      WHERE Company = '{COMPANY}'`],
        PostExecute: [],
    }
}

const TableFields = ({columns, tableName}: Pick<TableResponse, 'columns' | 'tableName'>) => {
    const ref = useRef<HTMLElement | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const clickHandler = () => {
        if (ref.current) {
            const sql = ref.current?.innerText ?? '';
            navigator.clipboard.writeText(sql)
                .then(() => {
                    setMessage('Fields copied to clipboard.');
                })
                .catch((err: unknown) => {
                    if (err instanceof Error) {
                        setMessage(err.message);
                    }
                })
        }
    }
    return (
        <div className="mb-3">
            <h4 onClick={clickHandler} style={{cursor: 'pointer'}}>
                Fields <small className="ms-1">(for MASDataTransferImplementation.php)</small>
            </h4>
            <ToastContainer className="position-fixed bottom-0 start-0 p-3">
                <Toast show={!!message} onClose={() => setMessage(null)} autohide delay={5000} bg="info">
                    <Toast.Header>
                        <div>{tableName} Fields</div>
                    </Toast.Header>
                    <Toast.Body>Content copied to clipboard.</Toast.Body>
                </Toast>
            </ToastContainer>
            <code ref={ref} className="db-create-table">
                {JSON.stringify(dbCreateTable(tableName, columns), undefined, 2)}
            </code>
        </div>
    )
}

export default TableFields;
