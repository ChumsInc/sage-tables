import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectQuery} from "./selectors";
import classNames from "classnames";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {saveQuery} from "./actions";

const SaveQueryButton = ({queryKey}: { queryKey: string }) => {
    const dispatch = useAppDispatch();
    const query = useAppSelector(state => selectQuery(state, queryKey));
    const [open, setOpen] = useState(false);
    const [filename, setFilename] = useState(query.filename ?? '');

    const saveHandler = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = () => {
        dispatch(saveQuery({...query, filename}));
        setOpen(false);
    }

    return (
        <>
            <button type="button" className={classNames("btn btn-sm", {
                'btn-warning': query.changed,
                'btn-outline-primary': !query.changed
            })} onClick={saveHandler}>
                Save
            </button>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Save Query</DialogTitle>
                <DialogContent>
                    <DialogContentText>Save as:</DialogContentText>
                    <TextField autoFocus margin="dense" fullWidth type="text" variant="standard" value={filename}
                               onChange={(ev) => setFilename(ev.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!filename}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SaveQueryButton;
