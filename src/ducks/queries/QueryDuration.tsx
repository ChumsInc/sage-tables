import React from "react";

const QueryDuration = ({duration}:{duration:number}) => {
    const unit = 'ms';
    return (
        <span>{duration || 'N/A'} {unit}</span>
    )
};

export default QueryDuration;
