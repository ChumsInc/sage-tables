import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {SERVERS} from "../constants";
import {fetchTables, fetchTable, addNewTab} from '../actions';
import ProgressBar from "../common-components/ProgressBar";
import SortableTable from "../common-components/SortableTable";

const fields = [
    {field: 'table', title: 'Table'}
];

class TableList extends Component {
    static propTypes = {
        tables: PropTypes.arrayOf(PropTypes.shape({
            server: PropTypes.string,
            list: PropTypes.array,
            loading: PropTypes.bool,
        })),
        fetchTables: PropTypes.func.isRequired,
        fetchTable: PropTypes.func.isRequired,
        addNewTab: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tables: [],
    };

    state = {
        server: SERVERS[0],
        filter: '',
        rowsPerPage: 25,
        page: 1,
    };

    constructor(props) {
        super(props);
        this.onChangeServer = this.onChangeServer.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onSelectTable = this.onSelectTable.bind(this);
        this.onQueryTable = this.onQueryTable.bind(this);
        fields[0].render = ({table}) => (
            <Fragment>
                <a href="#" onClick={(ev) => this.onSelectTable(ev, table)}>
                    <span className="material-icons md-12 zoom-table">zoom_in</span>
                </a>
                <a href="#" onClick={(ev) => this.onQueryTable(ev, table)}>{table}</a>
            </Fragment>
        )
    }

    componentDidMount() {
        this.onRefresh();
    }


    onChangeServer(ev) {
        const server = ev.target.value;
        this.setState({server});
        this.props.fetchTables(server);
    }

    onChangeFilter(ev) {
        this.setState({filter: ev.target.value});
    }

    onRefresh() {
        this.props.fetchTables(this.state.server);
    }
    
    onSelectTable(ev, table) {
        ev.preventDefault();
        this.props.fetchTable(this.state.server, table);
    }

    onQueryTable(ev, table) {
        const {server} = this.state;
        const query = `SELECT * FROM ${table}`;
        this.props.addNewTab({query, server});
    }

    render() {
        const {server, filter, page, rowsPerPage} = this.state;
        const [{loading = false, list = []} = {}] = this.props.tables.filter(tables => tables.server === server);
        let regex = /^/;
        try {
            regex = new RegExp(filter || '^', 'i');
        } catch(err) {

        }
        const data = list.filter(({table}) => regex.test(table));
        return (
            <div>
                <div>
                    <div className="input-group input-group-sm">
                        <select className="form-control" value={server} onChange={this.onChangeServer}>
                            {SERVERS.map(server => (
                                <option key={server} value={server}>{server.toUpperCase()}</option>
                            ))}
                        </select>
                        <div className="input-group-append">
                            <button type="button" className="btn btn-outline-primary" onClick={this.onRefresh}>
                                <span className="material-icons">refresh</span>
                            </button>
                        </div>
                    </div>
                    <div className="input-group input-group-sm">
                        <input type="text" placeholder="filter" value={filter} onChange={this.onChangeFilter}
                               className="form-control" />
                    </div>
                </div>
                {loading && <ProgressBar striped={true} style={{height: '3px'}}/>}
                <SortableTable fields={fields} data={data} defaultSort="table" keyField="table"
                               className="sage-table-list" paginationInline={false}
                               page={page} onChangePage={(page) => this.setState({page})} paginationClassName="pagination-sm"
                               rowsPerPage={rowsPerPage} onChangeRowsPerPage={(rowsPerPage) => this.setState({rowsPerPage, page: 1})}/>
            </div>
        );
    }
}

const mapStateToProps = ({tables}) => {
    return {
        tables
    };
};

const mapDispatchToProps = {fetchTables, fetchTable, addNewTab};

export default connect(mapStateToProps, mapDispatchToProps)(TableList) 
