import React from "react";

const Divider = ({label}) => {
    return (
        <div className="text-center">
            <span className="divider divider-text">{label}</span>
        </div>
    );
};

export default Divider;
