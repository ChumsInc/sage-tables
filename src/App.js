import React, {Component, Fragment} from 'react';
import AlertList from "./common-components/AlertList";
import TableList from "./components/TableList";
import TabList from "./components/TabList";
import TabContent from "./components/TabContent";
import ErrorBoundary from "./common-components/ErrorBoundary";


/**
 * @TODO: Add "Save Query" functionality.
 */

export default class App extends Component {
    static propTypes = {

    }

    componentDidMount() {
        window.addEventListener('beforeunload', (ev) => {
            ev.preventDefault();
            ev.returnValue = '';
        })
    }

    render() {
        return (
            <Fragment>
                <AlertList />
                <div className="row g-3">
                    <div className="col-2">
                        <TableList />
                    </div>

                    <div className="col-10">
                        <ErrorBoundary><TabList /></ErrorBoundary>
                        <ErrorBoundary><TabContent /></ErrorBoundary>
                        <a href="http://help-sage100.na.sage.com/2019/FLOR/index.htm#File_Layouts/File_Layouts_Overview.htm%3FTocPath%3DFile%2520Layouts%7C_____0" target="_blank">
                            Sage 2019 File Layouts
                        </a>
                    </div>
                </div>
            </Fragment>
        )
    }
}

