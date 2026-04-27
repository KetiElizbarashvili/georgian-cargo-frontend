import React from "react";
import {useFormikContext} from "formik";

const SingleSelect = (props) => {
    const {
        field,
        options,
        placeholder,
        label,
        error,
        className = "form-control",
        disabled,
        callback = null,
    } = {...props};
    const {setFieldValue, setFieldTouched} = useFormikContext();
    return (
        <>
            {label && (
                <label className="input-label" htmlFor={field.name}>
                    {label}
                </label>
            )}
            <select
                className={className.concat(error ? " is-invalid" : "")}
                disabled={disabled}
                {...field}
                onChange={({target: {value}}) => {
                  setFieldValue(field.name, value || '');
                }}
                onBlur={() => {setFieldTouched(field.name, true)}}
            >
                {placeholder && (
                    <option value={-1} defaultValue hidden>
                        {placeholder}
                    </option>
                )}
                {options.map(
                    callback
                        ? callback
                        : (option, i) => (
                              <option key={i} value={option?.value || option}>
                                  {option?.name || option}
                              </option>
                          )
                )}
            </select>
            {/* {error && (
                <label
                    className="text-danger ml-2 font-weight-light text-xs"
                    htmlFor={name}
                >
                    {error}
                </label>
            )} */}
            {error && <span className="text-danger font-size-1">{error}</span>}
        </>
    );
};

export default SingleSelect;
