import {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import classNames from "classnames";
import {saveQuery} from "./actions";
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {selectCurrentQuery} from "@/ducks/queries/queriesSlice.ts";

export interface SavedQueryButtonProps {
    changed?: boolean;
}

export default function SaveQueryButton({changed}: SavedQueryButtonProps) {
    const dispatch = useAppDispatch();
    const query = useAppSelector(selectCurrentQuery);
    const [open, setOpen] = useState(false);
    const [filename, setFilename] = useState(query?.filename ?? '');

    const saveHandler = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = () => {
        if (!query) {
            return;
        }
        dispatch(saveQuery({...query, filename}));
        setOpen(false);
    }

    return (
        <>
            <button type="button" className={classNames("btn btn-sm", {
                'btn-warning': changed,
                'btn-outline-primary': !changed
            })} onClick={saveHandler}>
                Save
            </button>
            <Modal show={open} onClose={handleClose} size="lg">
                <Modal.Header>Save Query</Modal.Header>
                <Modal.Body>
                    <h3>Save as:</h3>
                    <input type="text" className="form-control form-control-sm" value={filename}
                           onChange={(ev) => setFilename(ev.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} disabled={!filename}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
