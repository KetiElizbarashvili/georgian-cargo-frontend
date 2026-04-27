import { history } from "components/History";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import backURL from "./backURL";

const modalStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,.2)",
    alignItems: "center",
    justifyContent: "center",
    color: "##FFF",
    display: "flex",
    zIndex: "9999",
};
const modalHeaderStyles = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "1rem 1rem",
    borderBottom: "1px solid #dee2e6",
    borderTopLeftRadius: "calc(.3rem - 1px)",
    borderTopRightRadius: "calc(.3rem - 1px)",
};

const ModalPortal = (props) => {
    return createPortal(
        <div style={modalStyle} onClick={props.onClick}>
            {props.children}
        </div>,
        document.getElementById("modal_root")
    );
};

const RoutedModal = (props) => {
    const ref = useRef(null);
    const [clicked, setClickedOutside] = useState(false);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setClickedOutside(true);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const OnClick = () => {
        if (clicked) history.replace(backURL());
    };
    return (
        <ModalPortal onClick={OnClick}>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    pointerEvents: "auto",
                    backgroundColor: "#fff",
                    backgroundClip: "padding-box",
                    border: "1px solid rgba(0,0,0,.2)",
                    borderRadius: ".3rem",
                    outline: "0",
                    maxWidth: "100%",
                    margin: "auto",
                    maxHeight: "90%",
                    overflow: "auto",
                }}
                ref={ref}
                className={props.className}
            >
                <div style={modalHeaderStyles}>
                    <div className="modal-title h4">{props.header}</div>
                    <button className="close" onClick={() => history.replace(backURL())}>
                        <span aria-hidden="true">×</span>
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                {props.children}
            </div>
        </ModalPortal>
    );
};

export default RoutedModal;
