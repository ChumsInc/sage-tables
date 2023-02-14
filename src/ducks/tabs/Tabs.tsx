import React, {MouseEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentTab, selectTabs} from "./index";
import {addQuery} from "../queries";
import {selectCompany} from "../tables";
import {emptyQuery, getQueryKey} from "../../utils";
import {TabItem} from "chums-components";
import {closeTab, setTab} from "./actions";

const Tabs = () => {
    const dispatch = useAppDispatch();
    const tabs = useSelector(selectTabs);
    const currentTab = useSelector(selectCurrentTab);
    const company = useSelector(selectCompany);

    const newTabHandler = (ev:MouseEvent) => {
        ev.preventDefault();
        dispatch(addQuery({
            ...emptyQuery(company),
            key: getQueryKey(),
        }))
    }

    const onSelectTab = (key?: string) => {
        if (!key) {
            return;
        }
        dispatch(setTab(key));
    }

    const onCloseTab = (key?: string) => {
        if (!key) {
            return;
        }
        dispatch(closeTab(key));
    }

    return (
        <ul className="nav nav-tabs mb-2">
            <li className="nav-item">
                <a className="nav-link" href="#" onClick={newTabHandler}>+</a>
            </li>
            {Object.keys(tabs).map(key => (
                <TabItem key={key} id={key} active={currentTab === key}
                         title={/^[a-z0-9]+$/.test(key) ? (new Date(parseInt(key, 36)).toLocaleTimeString()) : key}
                         canClose
                         onSelect={onSelectTab}
                         onClose={onCloseTab}/>
            ))}
        </ul>
    )

}

export default Tabs;
