import React, {useEffect} from 'react';
import TablesContainer from "../ducks/tables/TablesContainer";
import Tabs from "../ducks/tabs/Tabs";
import TabContent from "../ducks/tabs/TabContent";
import {useAppDispatch} from "./configureStore";
import {addQuery} from "../ducks/queries";
import {emptyQuery, getQueryKey} from "../utils";
import {useSelector} from "react-redux";
import {selectCompany} from "../ducks/tables";
import {AppVersion} from "chums-components";


const App = () => {
    const dispatch = useAppDispatch();
    const company = useSelector(selectCompany);


    useEffect(() => {
        dispatch(addQuery({
            ...emptyQuery(company),
            key: getQueryKey(),
        }))
    }, []);

    return (
        <div className="row g-3">
            <div className="col-auto" style={{minWidth: '350px', maxWidth: '350px'}}>
                <TablesContainer />
                <AppVersion />
            </div>
            <div className="col" style={{minWidth: 'calc(100% - 350px - var(--bs-gutter-x))'}}>
                <Tabs />
                <TabContent />
            </div>
        </div>
    )
}

export default App;
