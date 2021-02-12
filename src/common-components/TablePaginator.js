import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import RowsPerPage from "./RowsPerPage";
import FormGroup from "./FormGroup";
import Pagination from "./Pagination";

export default class TablePaginator extends Component {
    static propTypes = {
        rows: PropTypes.number,
        page: PropTypes.number,
        rowsPerPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        filtered: PropTypes.bool,
        paginationClassName: PropTypes.string,
        paginationInline: PropTypes.bool,

        onChangePage: PropTypes.func,
        onChangeRowsPerPage: PropTypes.func,
    };

    static defaultProps = {
        rows: 0,
        page: 1,
        rowsPerPage: 25,
        filtered: false,
        paginationClassName: '',
        paginationInline: true,
    };

    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(page) {
        this.props.onChangePage(page);
    }

    render() {
        const {rows, page, rowsPerPage, filtered, paginationClassName, paginationInline} = this.props;
        const pages = Math.ceil(rows / rowsPerPage);

        return (
            <div className={classNames("page-display", {'row g-3': paginationInline})}>
                <FormGroup>
                    <RowsPerPage value={rowsPerPage} onChange={this.props.onChangeRowsPerPage}/>
                </FormGroup>
                <FormGroup label="Pages">
                    {rows > 0 && (
                        <Pagination activePage={page} pages={pages}
                                    className={paginationClassName}
                                    onSelect={this.handlePageChange}
                                    filtered={filtered}/>
                    )}
                    {rows === 0 && (
                        <strong>No records.</strong>
                    )}
                </FormGroup>
            </div>
        );
    }
}
