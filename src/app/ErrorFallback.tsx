import React from 'react';
import {Alert} from "chums-components";
import {FallbackProps} from "react-error-boundary";

export default function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
    return (
        <Alert color="danger">
            <strong>Sorry! Something went wrong.</strong>
            <div className="text-danger" style={{whiteSpace: 'pre-wrap'}}>{error.message}</div>
        </Alert>
    )
}
