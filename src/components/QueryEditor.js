import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {COMPANIES, SERVERS} from "../constants";
import FormGroup from "../common-components/FormGroup";
import Select from "../common-components/Select";
import {fetchQuery, setQuery} from '../actions';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {Controlled as CodeMirror} from "react-codemirror2";


require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/sql/sql');

class QueryEditor extends Component {
    static propTypes = {
        tab: PropTypes.string,
        query: PropTypes.string,
        server: PropTypes.string,
        company: PropTypes.string,
        limit: PropTypes.number,
        loading: PropTypes.bool,

        setQuery: PropTypes.func.isRequired,
        fetchQuery: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tab: null,
        query: '',
        server: SERVERS[0],
        company: COMPANIES[0],
        limit: 100,
        loading: false,
    };

    constructor(props) {
        super(props);
        this.updateQuery = this.updateQuery.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    updateQuery({field, value}) {
        this.props.setQuery(this.props.tab, {[field]: value});
    }

    handleQueryChange(editor, data, value) {
        this.updateQuery({field: 'query', value})
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.fetchQuery(this.props.tab);
    }

    onKeyDown(editor, ev) {
        if ((ev.code === 'Enter' || ev.code === 'NumpadEnter') && ev.ctrlKey) {
            this.onSubmit(ev);
        }
    }

    render() {
        const {tab, query, server, company, limit, offset} = this.props;
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="row form-inline mb-1">
                        <FormGroup label="Server" className="mr-3">
                            <Select onChange={this.updateQuery} field="server" value={server}>
                                {SERVERS.map(s => (<option key={s} value={s}>{s.toUpperCase()}</option>))}
                            </Select>
                        </FormGroup>
                        <FormGroup label="Company" className="mr-3">
                            <Select onChange={this.updateQuery} value={company} field="company">
                                {COMPANIES.map(c => (<option key={c} value={c}>{c.toUpperCase()}</option>))}
                            </Select>
                        </FormGroup>
                        <FormGroupTextInput type="number" label="Limit" formGroupClassName="mr-3"
                                            onChange={this.updateQuery} value={limit} field="limit"
                                            list="sage-tables__limit">
                            <datalist id="sage-tables__limit">
                                <option value="100"/>
                                <option value="250"/>
                                <option value="500"/>
                                <option value="750"/>
                                <option value="1000"/>
                            </datalist>
                        </FormGroupTextInput>
                        <FormGroupTextInput type="number" label="Offset" formGroupClassName="mr-3"
                                            onChange={this.updateQuery} value={offset} field="offset"/>
                        <FormGroup>
                            <button type="submit" className="btn btn-sm btn-primary ml-3">Submit</button>
                        </FormGroup>
                    </div>
                    <div>
                        <CodeMirror value={query} onBeforeChange={this.handleQueryChange} onKeyPress={this.onKeyDown}
                                    options={{lineNumbers: true, lineWrapping: true, viewportMargin: Infinity}}/>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = ({tab, queries, results}) => {
    const {query, server, company, limit, offset} = queries[tab] || {};
    const {loading} = results[tab] || {};
    return {
        tab,
        query,
        server,
        company,
        limit,
        offset,
        loading,
    };
};

const mapDispatchToProps = {setQuery, fetchQuery};

export default connect(mapStateToProps, mapDispatchToProps)(QueryEditor)
