import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentTab, selectTabs} from "./index";
import ErrorBoundary from "../../common-components/ErrorBoundary";
import TableDetail from "../tables/TableDetail";
import QueryEditor from "../queries/QueryEditor";
import QueryResult from "../queries/QueryResult";


const TabContent = () => {
    const currentTabKey = useSelector(selectCurrentTab);
    const tabs = useSelector(selectTabs);

    if (!currentTabKey) {
        return null;
    }

    switch (tabs[currentTabKey]) {
        case 'table':
            return (
                <ErrorBoundary>
                    <TableDetail tabKey={currentTabKey}/>
                </ErrorBoundary>
            );
        case 'query':
            return (
                <ErrorBoundary>
                    <QueryEditor queryKey={currentTabKey}/>
                    <QueryResult queryKey={currentTabKey}/>
                </ErrorBoundary>
            );
    }
}

export default TabContent;
