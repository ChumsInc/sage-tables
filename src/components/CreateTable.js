import React from 'react';


const mapColType = (colType = '', size = 0, decimals = 0) => {
    switch (colType.toUpperCase()) {
    case 'VARCHAR':
        if (Number(size) > 256) {
            return 'TEXT';
        }
        return `varchar(${size})`;
    case 'DECIMAL':
        return `decimal(${size},${decimals})`;
    case 'DATE':
        return 'date';
    default:
        return colType;
    }
};

const ColumnDefinition = ({colName, colType, size, decimals, nullable}) => {
    return (
        <div>{'\t'}`{colName}` {mapColType(colType, size, decimals)} {nullable ? 'DEFAULT NULL' : 'NOT NULL'},</div>
    )
};

const CreateTable = ({table, columns = [], primaryKeys = []}) => {
    return (
        <div>
            <pre>
                <code>
                    CREATE TABLE `c2`.`{table}` (
                    <ColumnDefinition colName="Company" colType="varchar" size={15} nullable={false}/>
                    {columns.map(c => (
                        <ColumnDefinition key={c.COLUMN_NAME}
                                          colName={c.COLUMN_NAME}
                                          colType={c.TYPE_NAME}
                                          size={c.COLUMN_SIZE}
                                          decimals={c.DECIMAL_DIGITS}
                                          nullable={primaryKeys.includes(c.COLUMN_NAME) === false}
                        />)
                    )}
                    <ColumnDefinition colName="timestamp" colType="timestamp" nullable={false}/>
                    {'\t'}PRIMARY KEY (`Company`, {primaryKeys.map(col => '`' + col + '`').join(',')})
                    {'\n'}
                    )
                </code>
            </pre>
        </div>
    )
};

export default CreateTable;
