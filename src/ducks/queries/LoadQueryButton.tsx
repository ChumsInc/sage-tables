import {useCallback, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {SavedQuery} from "../../types";
import {emptyQuery} from "../../utils";
import {Modal} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {selectCurrentQuery} from "@/ducks/queries/queriesSlice.ts";
import {loadQuery} from "@/ducks/queries/actions.ts";

export interface LoadQueryButtonProps {
    queryKey: string;
    changed?: boolean;
}

const LoadQueryButton = ({queryKey, changed}: LoadQueryButtonProps) => {
    const dispatch = useAppDispatch();
    const query = useAppSelector(selectCurrentQuery);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);

    const setQuery = useCallback((arg: SavedQuery) => {
        const query = {
            ...emptyQuery(arg.company ?? 'CHI'),
            key: queryKey,
            ...arg,
        };
        dispatch(loadQuery(query));
    }, [queryKey, dispatch])

    const fileChangeHandler = () => {
        if (fileInputRef.current) {
            const [file] = fileInputRef.current.files ?? [];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
                try {
                    setFilename(file.name);
                    const text = reader.result as string;
                    const query = JSON.parse(text) as Partial<SavedQuery>;
                    if (!query || !query.sql) {
                        setAlert(`Error: No SQL in file. Expected JSON with "sql" property.`);
                        return;
                    }
                    setOpen(false);
                    setQuery({
                        company: query.company ?? 'CHI',
                        sql: query.sql,
                        filename: file.name,
                    })
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        console.debug("fileChangeHandler()", err.message);
                        setAlert(err.message);
                        return Promise.reject(err);
                    }
                    console.debug("fileChangeHandler()", err);
                    return Promise.reject(new Error('Error in fileChangeHandler()'));
                }
            })
            reader.readAsText(file);
        }
    }

    const closeHandler = () => {
        setOpen(false);
        setAlert(null);
        setFilename(null);
    }

    if (!query) {
        return;
    }
    return (
        <>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setOpen(true)}>
                {!query.filename && <span>Load Query</span>}
                {!!query.filename && <span>{query.filename}</span>}
            </button>
            <Modal show={open} onClose={closeHandler} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Load Query</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {changed && (
                        <Alert variant="warning">
                            You're about to lose your changes!
                        </Alert>
                    )}
                    <div>
                        <input type="file" className="form-control form-control-sm" accept="application/json"
                               value=""
                               onChange={fileChangeHandler} ref={fileInputRef}/>
                    </div>
                    {!!alert && (
                        <Alert variant="warning" className="mt-3">
                            <strong className="me-3">{filename}</strong>
                            {alert}
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={closeHandler}>Cancel</Button>
                    <Button variant="primary" onClick={fileChangeHandler}>Open File</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LoadQueryButton
