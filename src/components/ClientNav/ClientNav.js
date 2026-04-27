import React, { useState, useEffect, useContext } from "react";
import ClientNavMenu from "components/clientNavMenu/ClientNavMenu";
import useRequest from "hooks/useRequest";
import { AuthContext } from "context";
import { Button } from "react-bootstrap";
// import Button from 'react-bootstrap/Button';
import clientAddress from "requests/clientAddress";
import { Link, useHistory } from "react-router-dom";
import md5 from 'md5';

const ClientNav = ({ user }) => {
  const history = useHistory();
  const { auth, setAuth } = useContext(AuthContext);
  const [getClientAddress] = useRequest(clientAddress);
  const [showResponsiveNav, setShowResponsiveNav] = useState(true);
  const [showChooseSourceCountryModal, setShowChooseSourceCountryModal] = useState(false);

  useEffect(() => {
    setShowChooseSourceCountryModal(false);
  }, []);


  const handleToggleResponsiveNav = () => {
    setShowResponsiveNav(!showResponsiveNav);
  };

  const openChooseSourceCountryModal = () => {
    console.log(auth);
    if (auth?.sourceCountry === '' || auth?.sourceCountry === 'null' || auth?.sourceCountry === null) {
      window.location.href = '/dashboard/address'
      // getClientAddress()
      //   .then((response) => {
      //     if (response.data.addresses !== undefined) {
      //       setAuth({
      //         ...auth,
      //         sourceCountry: response.data.addresses[0].address_country_code || cookies.originCountry
      //       });
      //     }
      //   }).then(() => setShowChooseSourceCountryModal(true));
    }
    else if (auth?.staff?.phone?.toString().length < 5) {
      window.location.href = '/dashboard/personal-info'
    }
    else {
      // return <Redirect to={"/dashboard/book-a-courier/" + auth.sourceCountry.toUpperCase()} />
      window.location.href = "/book-a-courier/" + auth.sourceCountry.toUpperCase() + '/' + 'GE';
      // setShowChooseSourceCountryModal(true);
    }
  };

  const closeChooseSourceCountryModal = () => {
    setShowChooseSourceCountryModal(false);
  };

  return (
    <>
      {/* <button onClick={handleToggleResponsiveNav} className="d-lg-none navbar-toggler btn btn-icon btn-sm rounded-circle btn btn-secondary float-end mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarNav" aria-controls="sidebarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-default">
          <svg
            width="14"
            height="14"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M17.4,6.2H0.6C0.3,6.2,0,5.9,0,5.5V4.1c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,5.9,17.7,6.2,17.4,6.2z M17.4,14.1H0.6c-0.3,0-0.6-0.3-0.6-0.7V12c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,13.7,17.7,14.1,17.4,14.1z"
            />
          </svg>
        </span>
      </button>
      <br className="d-lg-none" />
      <br className="d-lg-none" /> */}
      <>
        <div className="col-12 d-block d-sm-none d-md-none d-lg-none d-xl-none d-xxl-none">

          <div className="w-100 dropdown">
            <div className="w-35 float-start">
              <a className="btn btn-primary" onClick={openChooseSourceCountryModal} role="button" ><i className="bi bi-file-earmark-plus bi-lg"></i> Book
              </a>
            </div>
            <a className="w-50 btn float-end btn-white dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical"></i>&nbsp; Client Menu
            </a>

            <ul className="w-50 dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li><Link className="dropdown-item" to="/dashboard/personal-info"><i className="bi-person-badge nav-icon"></i>&nbsp; Personal Info</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/notifications"><i className="bi-bell nav-icon"></i>&nbsp; Notifications</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/address"><i className="bi-geo-alt nav-icon"></i>&nbsp; Address</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/loyalty"><i className="bi-gift nav-icon"></i>&nbsp; Loyalty</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/cargos"><i className="bi bi-card-list nav-icon"></i>&nbsp; Parcels</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/bookings"><i className="bi bi-mailbox nav-icon"></i>&nbsp; Bookings</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/coupons"><i className="bi bi-ticket-perforated nav-icon"></i>&nbsp; Coupons</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/cart"><i className="bi-basket nav-icon"></i>&nbsp; Cart</Link></li>

              <li><Link className="dropdown-item" to="/dashboard/payments"><i className="bi-credit-card nav-icon"></i>&nbsp; Payments</Link></li>

            </ul>
          </div>

        </div>
        <div style={{ minWidth: "50px" }} className="d-none d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block navbar-expand-lg navbar-light d-block w-full">
          <Button className="btn btn-sm mb-4 btn-secondary d-inline-block w-100 ripple"
            onClick={openChooseSourceCountryModal}
          >
            <i className="bi bi-file-earmark-plus"></i> <span className="d-none d-sm-none d-md-block d-lg-block">Book a courier</span>
          </Button>
          <div id="sidebarNav" className={"collapse navbar-collapse navbar-vertical " + (showResponsiveNav ? 'show' : '')}>
            <div className="card flex-grow-1 mb-5">
              <div className="card-body">
                <div className="d-none d-lg-block text-center mb-5">
                  <div className="avatar avatar-lg avatar-circle mb-2">
                    <img className="p-0 avatar-img" src={`http://www.gravatar.com/avatar/${md5(auth.staff.email)}`} alt="Image Description" />
                  </div>
                  <h4 className="card-title mb-0">{auth.staff?.username || ''}</h4>
                  <p className="card-text small">{auth.staff?.email}</p>
                  <p className="card-text small">Points: <Link to="/dashboard/loyalty" className="badge bg-primary">{user?.points}</Link></p>

                </div>
                <ClientNavMenu />
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ClientNav;