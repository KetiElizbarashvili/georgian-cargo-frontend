import React from "react";

const RoundImg = (props) => {
    const { spanClassName = "", className = "", src = "", alt = "", style } = {...props};
    const OnError = (e) => {
        e.target.src = "../../callback.jpg";
        e.target.onError = null;
    };
    return (
        <span className={spanClassName}>
            <img
                className={className}
                src={src}
                alt={alt}
                onError={OnError}
                style={style}
            />
        </span>
    );
};

export default RoundImg;
