import React from "react";

const PaymentStatus = ({ status, link }) => {
    return status !== "NOT_PAID" ? (
        <>
            <span className="badge badge bg-success">Paid </span>
            <br />
            <a href={link} target="_blank" rel="noopener noreferrer">
                Invoice link{" "}
            </a>
        </>
    ) : (
        <span className="badge badge-warning">Not Paid </span>
    );
};
export default PaymentStatus;
