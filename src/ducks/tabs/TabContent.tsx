import {useSelector} from "react-redux";
import {selectCurrentTab, selectTabs} from "./selectors";
import TableDetail from "../tables/TableDetail";
import QueryEditor from "../queries/QueryEditor";
import QueryResult from "../queries/QueryResult";
import QueryErrorAlert from "../queries/QueryErrorAlert";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallback from "@/app/ErrorFallback.tsx";


const TabContent = () => {
    const currentTabKey = useSelector(selectCurrentTab);
    const tabs = useSelector(selectTabs);

    if (!currentTabKey) {
        return null;
    }

    switch (tabs[currentTabKey]) {
        case 'table':
            return (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <TableDetail tabKey={currentTabKey}/>
                </ErrorBoundary>
            );
        case 'query':
            return (
                <div key={currentTabKey} className="tab-pane active" id={currentTabKey} role="tabpanel">
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <QueryEditor queryKey={currentTabKey}/>
                        <QueryErrorAlert />
                        <QueryResult queryKey={currentTabKey}/>
                    </ErrorBoundary>
                </div>
            );
    }
}

export default TabContent;
