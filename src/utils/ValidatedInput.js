import React from "react";

const ValidatedInput = (props) => {
    const {
        label,
        value,
        name,
        type,
        placeholder,
        id,
        required,
        error,
        requiredMsg,
        onChange,
        className = "form-control",
        checked,
        disabled,
    } = {
        ...props,
    };
    return (
        <>
            {label && (
                <label className="input-label" htmlFor={id ? id : name}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={className.concat(error ? " is-invalid" : "")}
                name={name}
                value={value ? value : ""}
                id={id ? id : null}
                placeholder={placeholder}
                aria-label={placeholder}
                required={required}
                data-msg={requiredMsg}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />
            {/* {error && (
                <label className="text-danger ml-2 font-weight-light text-xs">
                    {error}
                </label>
            )} */}
            {error && <span className="text-danger font-size-1">{error}</span>}
        </>
    );
};

export default ValidatedInput;
