/**
 * Created by steve on 9/15/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

const SortIcon = ({asc = true}) => {
    return (
        <span className="material-icons md-18">{asc ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
    )
};

export default class ThSortable extends Component {
    static propTypes = {
        field: PropTypes.string.isRequired,
        currentSort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }).isRequired,
        noSort: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: '',
        currentSort: {
            field: '',
            asc: true,
        },
        noSort: false,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.field);
    }
    render() {
        const {currentSort, field, noSort, children} = this.props;
        return noSort
            ? (<th>{children}</th>)
            : (
                <th className={classNames({sorted: currentSort.field === field, desc: currentSort.asc === false})}
                    onClick={this.onClick}>
                    {children}
                    {currentSort.field === field && <SortIcon asc={currentSort.asc}/>}
                </th>
            )
    }
}
