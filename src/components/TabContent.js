import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TableDetail from "./TableDetail";
import QueryContent from "./QueryEditor";
import {addNewTab} from '../actions';
import QueryResult from "./QueryResult";
import AlertList from "../common-components/AlertList";
import ErrorBoundary from "../common-components/ErrorBoundary";

class TabContent extends Component {
    static propTypes = {
        tab: PropTypes.string,
        query: PropTypes.shape({}),
        table: PropTypes.shape({}),
        addNewTab: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    componentDidMount() {
        this.props.addNewTab();
    }


    render() {
        const {tab, query, table} = this.props;
        return (
            <div className="query-results">
                {table && <TableDetail {...this.props.table} />}
                {!!tab && !table && (<ErrorBoundary><QueryContent /></ErrorBoundary>)}
                {!!tab && (<ErrorBoundary><AlertList tab={tab}/></ErrorBoundary>)}
                {!!tab && !table && (<ErrorBoundary><QueryResult /></ErrorBoundary>)}
            </div>
        );
    }
}

const mapStateToProps = ({queries, tableDetails, tab}) => {
    return {
        tab,
        query: queries[tab] || null,
        table: tableDetails[tab] || null,
    };
};

const mapDispatchToProps = {
    addNewTab
};

export default connect(mapStateToProps, mapDispatchToProps)(TabContent) 
