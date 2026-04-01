import type {MouseEvent} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCurrentTab, selectTabs} from "./selectors";
import {addQuery} from "../queries/queriesSlice.ts";
import {selectCompany} from "../tables/tablesSlice";
import {emptyQuery, getQueryKey} from "../../utils";
import {closeTab, setTab} from "./actions";
import dayjs from "dayjs";
import {CloseButton, Nav} from "react-bootstrap";

const Tabs = () => {
    const dispatch = useAppDispatch();
    const tabs = useSelector(selectTabs);
    const currentTab = useSelector(selectCurrentTab);
    const company = useSelector(selectCompany);

    const newTabHandler = (ev: MouseEvent) => {
        ev.preventDefault();
        dispatch(addQuery({
            ...emptyQuery(company),
            key: getQueryKey(),
        }))
    }

    const onSelectTab = (key: string|null) => {
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
        <Nav variant="tabs" className="mb-2" activeKey={currentTab ?? 'new'} onSelect={onSelectTab} >
            <Nav.Item>
                <Nav.Link onClick={newTabHandler} eventKey="new">+</Nav.Link>
            </Nav.Item>
            {Object.keys(tabs).map(key => (
                <Nav.Item key={key}>
                    <Nav.Link eventKey={key}>
                        <span className="me-1">{/^[a-z0-9]+$/.test(key) ? (dayjs(parseInt(key, 36)).format('HH:mm:ss')) : key}</span>
                        <CloseButton onClick={() => onCloseTab(key)} />
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    )

}

export default Tabs;
