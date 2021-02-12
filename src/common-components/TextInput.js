import React, {Fragment} from 'react';
import classNames from 'classnames';


const TextInput = React.forwardRef((props, ref) => {
    const {onChange, field, className = '', helpText = null, id = '', dataList = [], ...rest} = props;
    const _className = {
        'form-control': true,
        'form-control-sm': !className.split(' ').includes('form-control-lg'),
        className
    };

    const changeValue = (ev) => {
        switch (props.type) {
        case 'number':
            return Number(ev.target.value);
        default:
            return ev.target.value;
        }
    };

    const dataListId = dataList.length && id ? `${id}-datalist` : undefined;

    return (
        <Fragment>
            <input id={id} className={classNames(_className)} list={dataListId}
                   onChange={ev => onChange({field, value: changeValue(ev)})}
                   ref={ref} {...rest} />
            {helpText && <small className="form-text text-muted">{helpText}</small>}
            {dataListId && (
                <datalist id={dataListId}>
                    {dataList.map(datum => (<option value={datum}/>))}
                </datalist>
            )}
        </Fragment>
    );
});

export default TextInput;
