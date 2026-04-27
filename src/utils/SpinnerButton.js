import React from "react";

const SpinnerButton = (props) => {
  const { loading, className, type = "submit", onClick, style } = { ...props };
  return (
    <button
      className={className + (loading ? " cursor-not-allowed" : "")}
      type={type}
      disabled={loading}
      onClick={onClick}
      style={style}
    >
      {loading ? <i className="fas fa-spinner fa-spin"></i> : props.children}
    </button>
  );
};

export default SpinnerButton;
