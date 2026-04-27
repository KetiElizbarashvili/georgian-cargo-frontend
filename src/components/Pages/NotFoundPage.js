import { ClientFooter } from "components/Footer";
import React from "react";
import { ReplaceLink } from "utils";

const NotFoundPage = () => {
    return (
        <>
            <main
                className="bg-img-hero-fixed"
                style={{
                    backgroundImage: "url(/theme/assets/svg/illustrations/error-404.svg)",
                }}
            >
                <div className="d-lg-flex">
                    <div className="container d-lg-flex align-items-lg-center min-vh-lg-100 space-4">
                        <div className="w-lg-60 w-xl-50">
                            <div className="mb-4">
                                <img
                                    className="max-w-23rem mb-3"
                                    src="/theme/assets/svg/illustrations/error-number-404.svg"
                                    alt="SVG Illustration"
                                />
                                <p className="lead">
                                    Oops! Looks like you followed a bad link. <br /> If
                                    you think this is a problem with us, please tell us.{" "}
                                </p>
                            </div>

                            <ReplaceLink
                                className="btn btn-wide btn-secondary transition-3d-hover"
                                to="/home"
                            >
                                Go To Home
                            </ReplaceLink>
                        </div>
                    </div>
                </div>
            </main>
            <ClientFooter />
        </>
    );
};

export default NotFoundPage;
