import {useSelector} from "react-redux";
import {dismissAlert, selectAlerts} from "./index";
import {useAppDispatch} from "@/app/configureStore";
import Alert from "react-bootstrap/Alert";
import {Badge} from "react-bootstrap";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAlerts);

    const dismissHandler = (key:string|number) => dispatch(dismissAlert(key));

    return (
        <div>
            {Object.keys(alerts).map(key => (
                <Alert key={key} variant={alerts[key].color} onClose={() => dismissHandler(key)}>
                    [<strong>{alerts[key].context}</strong>]
                    {alerts[key].count > 1 && <Badge bg={alerts[key].color} />}
                    <span className="ms-1">{alerts[key].message}</span>
                    {!!alerts[key].error && (
                        <div style={{whiteSpace: 'pre-wrap'}}>{alerts[key].error?.stack}</div>
                    )}
                </Alert>
            ))}
        </div>
    )
}

export default AlertList;
