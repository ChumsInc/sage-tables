import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";


const AlertDismisser = ({onDismiss}) => {
    return (
        <button type="button" className="btn-close" aria-label="Close"
                onClick={() => onDismiss()}>
        </button>
    )
};

export default class Alert extends Component {
    static propTypes = {
        id: PropTypes.number,
        type: PropTypes.string,
        title: PropTypes.string,
        message: PropTypes.string,
        onDismiss: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        const {id} = this.props;
        this.props.onDismiss(id);
    }

    render() {
        const {title, message, type, onDismiss, children} = this.props;
        const dismissible = typeof onDismiss === 'function';
        const className = classNames('alert my-3', {
            'alert-dismissible': dismissible,
            'alert-primary': type === 'primary',
            'alert-success': type === 'success',
            'alert-info': type === 'info' || type === undefined,
            'alert-secondary': type === 'secondary',
            'alert-danger': type === 'danger' || type === 'error',
            'alert-warning': type === 'warning',
            'alert-light': type === 'light',
            'alert-dark': type === 'dark',
        });
        return (
            <div className={className}>
                <strong className="me-1">{title || ''}</strong>
                {message || children}
                {dismissible && <AlertDismisser onDismiss={this.onDismiss}/>}
            </div>
        )
    }
}
