import React, { useState, useEffect, useContext } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Util } from "../../utils";
import { useCookies } from "react-cookie";
import { useLogout } from "hooks";


const ClientNavMenu = () => {
  const history = useHistory();
  const location = useLocation();
  const { logout } = useLogout();

  const [cookies, setCookie, removeCookie] = useCookies(['parcelsCart']);

  return (
    <>
      <span className={"text-cap d-none d-sm-none d-md-block d-lg-block "}>Account</span>
      <ul className="nav nav-sm nav-tabs nav-vertical mb-4">
        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link " + (Util.checkIsActive(location, "dashboard/personal-info") ? ' active' : '')}
            onClick={() => history.push("/dashboard/personal-info")}
            to="/dashboard/personal-info"
          >
            <i className="bi-person-badge nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Personal info</span>
          </Link>
        </li>
        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link " + (Util.checkIsActive(location, "dashboard/notifications") ? ' active' : '')}
            onClick={() => history.push("/dashboard/notifications")}
            to="/dashboard/notifications"

          >
            <i className="bi-bell nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Notifications</span>
          </Link>
        </li>
        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link " + (Util.checkIsActive(location, "dashboard/address") ? ' active' : '')}
            onClick={() => history.push("/dashboard/address")}
            to={"/dashboard/address"}
          >
            <i className="bi-geo-alt nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Address</span>
          </Link>
        </li>
        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link " + (Util.checkIsActive(location, "dashboard/loyalty") ? ' active' : '')}
            onClick={() => history.push("/dashboard/loyalty")}
            to={"/dashboard/loyalty"}

          >
            <i className="bi-gift nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Refferal <div style={{ fontSize: "11px" }} className="badge bg-warning ms-1">new</div></span>
          </Link>
        </li>
      </ul>

      <span className="text-cap d-none d-sm-none d-md-block d-lg-block">History</span>

      <ul className="nav nav-sm nav-tabs nav-vertical mb-4">
        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link" + (Util.checkIsActive(location, "dashboard/cargos") ? ' active' : '')}
            onClick={() => history.push("/dashboard/cargos")}
            to={"/dashboard/cargos"}
          >
            <i className="bi bi-card-list nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Parcels</span>
          </Link>
        </li>

        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link" + (Util.checkIsActive(location, "dashboard/bookings") ? ' active' : '')}
            onClick={() => history.push("/dashboard/bookings")}
            to={"/dashboard/bookings"}
          >
            <i className="bi bi-mailbox nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">bookings</span>
          </Link>
        </li>

        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link" + (Util.checkIsActive(location, "dashboard/coupons") ? ' active' : '')}
            onClick={() => history.push("/dashboard/coupons")}
            to={"/dashboard/coupons"}
          >
            <i className="bi bi-ticket-perforated nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Coupons</span>
          </Link>
        </li>


        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            className={"ps-sm-3 ps-2 nav-link" + (Util.checkIsActive(location, "dashboard/cart") ? ' active' : '')}
            onClick={() => history.push("/dashboard/cart")}
            to={"/dashboard/cart"}
          >
            <i className="bi-basket nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Cart ({cookies.parcelsCart === undefined ? 0 : cookies.parcelsCart.length})</span>
          </Link>
        </li>
      </ul>

      <span className="text-cap d-none d-sm-none d-md-block d-lg-block">Billing</span>

      <ul className="nav nav-sm nav-tabs nav-vertical">
        <li className="nav-item text-center">
          <Link
            style={{ fontSize: "13px" }}
            to={"/dashboard/payments"}
            className={"ps-sm-3 ps-2 nav-link" + (Util.checkIsActive(location, "dashboard/payments") ? ' active' : '')}
            onClick={() => history.push("/dashboard/payments")}>
            <i className="bi-credit-card nav-icon"></i>
            <span className="d-none d-sm-none d-md-block d-lg-block">Payments</span>
          </Link>
        </li>
      </ul>

      <div className="d-lg-none">
        <div className="dropdown-divider"></div>

        <ul className="nav nav-sm nav-tabs nav-vertical">
          <li className="nav-item text-center">
            <a role="button" className="ps-sm-3 ps-2 nav-link" onClick={logout}
              style={{ fontSize: "13px" }}
            >
              <i className="bi-box-arrow-right nav-icon"></i>
              <span className="d-none d-sm-none d-md-block d-lg-block">Log out</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default ClientNavMenu;