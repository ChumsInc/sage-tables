import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addNewTab, setTab, closeTab} from '../actions';
import classNames from 'classnames';

const Tab = ({active = false, id, title, onSelect, onClose}) => {
    const onClick = (ev) => {
        ev.preventDefault();
        onSelect(id);
    };

    const onClickClose = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        onClose(id);
    }
    return (
        <li className="nav-item">
            <a className={classNames('nav-link', {active})} href="#" onClick={onClick}>
                {title || id}
                <button type="button" className="btn-close ms-1" aria-label="Close" onClick={onClickClose}></button>
            </a>
        </li>
    );
};

class TabList extends Component {
    static propTypes = {
        tabs: PropTypes.arrayOf(PropTypes.string),
        tabNames: PropTypes.object,
        setTab: PropTypes.func.isRequired,
        addNewTab: PropTypes.func.isRequired,
        closeTab: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tabs: [],
        tabNames: {},
    };

    constructor(props) {
        super(props);
        this.onNewTab = this.onNewTab.bind(this);
    }

    onNewTab(ev) {
        ev.preventDefault();
        this.props.addNewTab();
    }


    render() {
        const {tabs, tab, tabNames} = this.props;
        return (
            <ul className="nav nav-tabs mb-2">
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={this.onNewTab}>+</a>
                </li>
                {tabs.map(_tab => (
                    <Tab key={_tab} id={_tab} active={tab === _tab}
                         title={/^[a-z0-9]+$/.test(_tab) ? (tabNames[_tab] || new Date(parseInt(_tab, 36)).toLocaleTimeString()) : _tab}
                         onSelect={(id) => this.props.setTab(id)}
                         onClose={(id) => this.props.closeTab(id)}/>
                ))}
            </ul>
        );
    }
}

const mapStateToProps = ({tabs, tab, tabNames}) => {
    return {
        tabs,
        tab,
        tabNames,
    };
};

const mapDispatchToProps = {
    setTab,
    addNewTab,
    closeTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabList) 
