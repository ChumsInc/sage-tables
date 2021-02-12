import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ProgressBar from "../common-components/ProgressBar";
import SortableTable from "../common-components/SortableTable";


const QueryDuration = ({duration}) => {
    const unit = 'ms';
    return (
        <span>{duration || 'N/A'} {unit}</span>
    )
};

class QueryResult extends Component {
    static propTypes = {
        tab: PropTypes.string,
        rows: PropTypes.number,
        columns: PropTypes.arrayOf(PropTypes.shape({Name: PropTypes.string, FieldType: PropTypes.string})),
        data: PropTypes.array,
        dirty: PropTypes.bool,
        loading: PropTypes.bool,
        timings: PropTypes.shape({}),
    };

    static defaultProps = {
        tab: '',
        rows: 0,
        columns: [],
        data: [],
        timings: {duration: null},
        dirty: false,
        loading: false,
    };

    state = {
        page: 1,
        rowsPerPage: 10,
        selected: null,
    };

    render() {
        const {rows, columns, data, dirty, loading, timings} = this.props;
        const {page, rowsPerPage, selected} = this.state;
        const fields = columns.map(col => ({field: col.Name}));
        return (
            <div className="query-results-container">
                <ProgressBar striped={true} style={{height: '5px'}} value={loading ? 100 : 0}/>
                <code>
                    <span>{JSON.stringify({rows, dirty})}</span>
                    <span className="ml-3">
                        Duration: <QueryDuration duration={timings.duration} />
                    </span>

                </code>
                <SortableTable fields={fields} data={data} className="table-results" responsive={true}
                               keyField="__index"
                               selected={selected}
                               page={page} rowsPerPage={rowsPerPage}
                               onChangePage={(page) => this.setState({page})}
                               onChangeRowsPerPage={(rowsPerPage) => this.setState({page: 1, rowsPerPage})}
                               onSelect={({__index: selected}) => this.setState({selected})}/>
            </div>
        );
    }
}

const mapStateToProps = ({tab, results}) => {
    const {rows, columns, data, dirty, loading, timings} = results[tab] || {};
    return {
        tab,
        rows,
        columns,
        data,
        dirty,
        loading,
        timings,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(QueryResult) 
