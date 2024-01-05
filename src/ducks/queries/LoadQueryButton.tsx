import React, {useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectQuery} from "./selectors";
import {loadQuery} from "./actions";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {SavedQuery} from "../../types";
import {emptyQuery} from "../../utils";

const LoadQueryButton = ({queryKey}: { queryKey: string }) => {
    const dispatch = useAppDispatch();
    const query = useAppSelector((state) => selectQuery(state, queryKey));
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);

    const fileChangeHandler = () => {
        setOpen(false);
        if (fileInputRef.current) {
            const [file] = fileInputRef.current.files ?? [];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
                try {
                    const text = reader.result as string;
                    const query = JSON.parse(text) as Partial<SavedQuery>;
                    if (!query || !query.sql) {
                        return;
                    }
                    dispatch(loadQuery({
                        ...emptyQuery(query.company ?? 'CHI'),
                        key: queryKey,
                        sql: query.sql ?? '',
                        filename: file.name,
                    }));
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        console.debug("fileChangeHandler()", err.message);
                        return Promise.reject(err);
                    }
                    console.debug("fileChangeHandler()", err);
                    return Promise.reject(new Error('Error in fileChangeHandler()'));
                }
            })
            reader.readAsText(file);
        }
    }

    const closeHandler = () => setOpen(false);

    return (
        <>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setOpen(true)}>
                {!query.filename && <span>Load Query</span>}
                {!!query.filename && <span>{query.filename}</span>}
            </button>
            <Dialog open={open} onClose={closeHandler} maxWidth="md" fullWidth>
                {query.changed && (<DialogTitle>
                        You're about to lose your changes!
                    </DialogTitle>
                )}
                {!query.changed && (<DialogTitle>
                    Load a query
                </DialogTitle>)}
                <DialogContent>
                    <DialogContentText>Open File:</DialogContentText>
                    <input type="file" className="form-control form-control-sm" accept="application/json"
                           value=""
                           onChange={fileChangeHandler} ref={fileInputRef}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeHandler}>Cancel</Button>
                    <Button onClick={fileChangeHandler}>Open File</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default LoadQueryButton
