import Alert from "react-bootstrap/Alert";
import type {FallbackProps} from "react-error-boundary";

export default function ErrorFallback({error}: FallbackProps) {
    if (error instanceof Error) {
        return (
            <Alert variant="danger">
                <strong>Sorry! Something went wrong.</strong>
                <div className="text-danger" style={{whiteSpace: 'pre-wrap'}}>{error.message}</div>
            </Alert>
        )
    }
    return (
        <Alert variant="danger">
            <strong>Sorry! Something went wrong.</strong>
            <div className="text-danger" style={{whiteSpace: 'pre-wrap'}}>Unknown error</div>
        </Alert>
    )
}
