import React from "react";

const Img = ({className = "", src = "", alt = "", style = {}}) => {
    const OnError = (e) => {
        e.target.src = "/callback.jpg";
        e.target.onError = null;
    };
    return (
        <img className={className} src={src} alt={alt} onError={OnError} style={style} />
    );
};

export default Img;
