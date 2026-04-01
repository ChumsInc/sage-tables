import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import Alert from "react-bootstrap/Alert";
import {selectCurrentQueryError, dismissAlert} from "@/ducks/queries/queriesSlice.ts";


export default function QueryErrorAlert() {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectCurrentQueryError);
    if (!error) {
        return null;
    }

    const closeHandler = () => {
        dispatch(dismissAlert())
    };

    return (
        <Alert variant="danger" dismissible onClose={closeHandler}>
            <pre>
                <code>
            {error}
                </code>
            </pre>
        </Alert>
    )
}
