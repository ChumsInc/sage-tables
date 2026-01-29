import {useAppSelector} from "../../app/configureStore";
import Alert from "react-bootstrap/Alert";
import {selectCurrentQueryError} from "@/ducks/queries/index.ts";

export default function QueryErrorAlert() {
    const error = useAppSelector(selectCurrentQueryError);
    if (!error) {
        return null;
    }

    return (
        <Alert variant="danger">{error}</Alert>
    )
}
