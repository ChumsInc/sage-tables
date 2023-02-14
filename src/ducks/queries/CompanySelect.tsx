import React, {SelectHTMLAttributes} from "react";
import classNames from "classnames";

export default function CompanySelect({value, onChange, className, ...props}: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">
                <span className="bi-database"/>
            </div>
            <select value={value} onChange={onChange} className={classNames("form-select form-select-sm", className)}>
                <option value="CHI">CHI</option>
                <option value="TST">TST</option>
            </select>
        </div>
    )
}
