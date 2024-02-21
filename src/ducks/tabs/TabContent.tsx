import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentTab, selectTabs} from "./selectors";
import ErrorBoundary from "../../common-components/ErrorBoundary";
import TableDetail from "../tables/TableDetail";
import QueryEditor from "../queries/QueryEditor";
import QueryResult from "../queries/QueryResult";
import QueryErrorAlert from "../queries/QueryErrorAlert";


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
                    <QueryErrorAlert queryKey={currentTabKey} />
                    <QueryResult queryKey={currentTabKey}/>
                </ErrorBoundary>
            );
    }
}

export default TabContent;
