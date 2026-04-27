import React from "react";
import { Link } from "react-router-dom";
import { history } from "components/History";
import { ClientFooter } from "components/Footer";

const HomePage = () => {
  const divStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "40px",
    border: "5px solid pink",
    padding: 10,
  };
  return (
    <>
      <div style={divStyle}>
        <h1>You have successfully registered</h1>
        <p>Click Button Bellow to go back to homepage</p>
        <Link
          className="btn btn-sm btn-secondary  d-sm-inline-block transition-3d-hover"
          onClick={() => history.push("/home")}
          to={"/home"}
        >
          Click Here
        </Link>
      </div>
      <ClientFooter />

    </>
  );
};

export default HomePage;
