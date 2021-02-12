import React, {Component} from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true, message: error.message};
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    render() {
        const {hasError, message} = this.state;
        if (hasError) {
            return (
                <>
                    <h1>Something went wrong!?</h1>
                    <div>{message}</div>
                </>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
