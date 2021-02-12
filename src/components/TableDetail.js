import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CreateTable from "./CreateTable";


const RowVarChar = ({isPrimary = false, COLUMN_NAME, TYPE_NAME, COLUMN_SIZE}) => {
    return (
        <tr>
            <td>{isPrimary && <span className="material-icons md-12">vpn_key</span>}</td>
            <td>{COLUMN_NAME}</td>
            <td>{TYPE_NAME}({COLUMN_SIZE})</td>
        </tr>
    )
};

const TableListRow = ({isPrimary = false, TYPE_NAME, ...props}) => {
    switch (TYPE_NAME) {
    case 'VARCHAR':
        return (<RowVarChar isPrimary={isPrimary} TYPE_NAME={TYPE_NAME} {...props}/>);
    case 'DECIMAL':
        return (
            <tr>
                <td>{isPrimary && <span className="material-icons">vpn_key</span>}</td>
                <td>{props.COLUMN_NAME}</td>
                <td>{TYPE_NAME}({props.NUM_PREC_RADIX}, {props.DECIMAL_DIGITS})</td>
            </tr>
        );
    default:
        return (
            <tr>
                <td>{isPrimary && <span className="material-icons md-12">vpn_key</span>}</td>
                <td>{props.COLUMN_NAME}</td>
                <td>{TYPE_NAME}({props.COLUMN_SIZE})</td>
            </tr>
        )
    }
};

const IndexList = ({indexName, unique = false, fields = [], filter = null}) => {
    return (
        <div>
            <code><strong>{indexName}</strong></code>
            <code className="ml-3">{fields.join(', ')}</code>
        </div>
    )
};

export default class TableDetail extends Component {
    static propTypes = {
        server: PropTypes.string,
        table: PropTypes.string,
        columns: PropTypes.arrayOf(PropTypes.shape({
            COLUMN_NAME: PropTypes.string,
            TYPE_NAME: PropTypes.string,
            COLUMN_SIZE: PropTypes.string,
            NUM_PREC_RADIX: PropTypes.string,
            DECIMAL_DIGITS: PropTypes.string,
            NULLABLE: PropTypes.string,
        })),
        primary_keys: PropTypes.arrayOf(PropTypes.string),
        indexes: PropTypes.object,
    };

    static defaultProps = {
        server: '',
        table: '',
        columns: [],
        primary_keys: [],
        indexes: {},
    };

    render() {
        const {server, table, columns, primary_keys, indexes} = this.props;
        return (
            <div className="table-detail">
                <h3>{server.toUpperCase()} - {table}</h3>
                <div className="row">
                    <div className="col-md-3">
                        <table className="table table-hover table-sm table-column-list">
                            <tbody>
                            {columns.map(col => (<TableListRow key={col.COLUMN_NAME} isPrimary={primary_keys.includes(col.COLUMN_NAME)} {...col} />))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-9">
                        <div className="mb-3">
                            <h3>Indexes</h3>
                            {Object.keys(indexes).map(key => <IndexList key={key} indexName={key} {...indexes[key]}/>)}
                        </div>
                        <div className="mb-3">
                            <h3>Fields <small>(for MASDataTransferImplmentation.php)</small></h3>
                            <code>{JSON.stringify(columns.map(col => col.COLUMN_NAME))}</code>
                        </div>
                        <div className="mb-3">
                            <h3>Create Table <small>(for MySQL)</small></h3>
                            <CreateTable table={table} columns={columns} primaryKeys={primary_keys} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
