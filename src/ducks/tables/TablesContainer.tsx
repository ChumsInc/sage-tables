import React from 'react';
import TablesFilter from "./TablesFilter";
import TablesList from "./TablesList";

const TablesContainer:React.FC = () => {

    return (
        <div>
            <TablesFilter />
            <TablesList />
        </div>
    )
}

export default TablesContainer;
