import {AuthContext} from "context";
import {useLogout} from "hooks";
import React, {useContext} from "react";
import Navbar from "./Navbar";

const AgentNavbar = () => {
    const {logout} = useLogout();
    const {auth} = useContext(AuthContext);
    return (
        <Navbar>
            {auth.isLoggedIn &&
                <ul className="js-scroll-nav navbar-nav ms-sm-auto">
                    <li onClick={logout} className="navbar-nav-last-item text-end pointer">
                        <i className="fas fa-sign-out-alt nav-icon"></i>
                    Log out
                </li>
                </ul>
            }
        </Navbar>
    );
};

export default AgentNavbar;
