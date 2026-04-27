import React from "react";
import {Multiselect} from "multiselect-react-dropdown";
import "./MultiSelect.css";

const MultiSelect = (props) => {
    const {
        options,
        displayValue,
        isObject,
        onSelect,
        placeholder,
        selectedValues,
        name,
        singleSelect = false,
        disabled = false,
        label,
        error,
        selectionLimit,
        id,
    } = {...props};
    const defaultStyle = {
        searchBox: {
            minHeight: "51.59px",
            borderColor: "#dcdcdc",
            backgroundColor: "#ffffff",
            color: "#333",
        },
    };
    return (
        <>
            {label && (
                <label className="input-label" htmlFor={name}>
                    {label}
                </label>
            )}
            <Multiselect
                options={options}
                displayValue={displayValue}
                isObject={isObject}
                singleSelect={singleSelect}
                onSelect={(list, item) =>
                    onSelect({
                        target: {
                            value: list,
                            name: name,
                        },
                    })
                }
                disablePreSelectedValues={disabled}
                placeholder={placeholder}
                style={defaultStyle}
                selectionLimit={selectionLimit}
                selectedValues={selectedValues}
                id={id}
            />
            {error && (
                <label
                    className="text-danger ml-2 font-weight-light text-xs"
                    htmlFor={id}
                >
                    {error}
                </label>
            )}
        </>
    );
};

export default MultiSelect;
