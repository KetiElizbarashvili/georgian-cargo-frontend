import { React, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Collapse } from 'react-bootstrap'

const Navbar = (props) => {
  const [isVisible, initHs] = useState(false)
  const invokeCollapse = () => {
    return initHs(!isVisible)
  }

  return (
    <></>
    // <header className="navbar navbar-expand-lg navbar-shadow navbar-end mb-3">
    //   <div className="container">
    //     <div className="navbar-nav-wrap">
    //       <div className="navbar-brand-wrapper">
    //         <a className="navbar-brand" href="/home" aria-label="Front">
    //           <img className="navbar-brand-logo" src="/logo.png" alt="Logo" />

    //         </a>
    //       </div>

    //       <button type="button" className="navbar-toggler ms-auto" data-bs-toggle="collapse" data-bs-target="#navbarNavMenuLeftAligned" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbarNavMenuLeftAligned">
    //         <span className="navbar-toggler-default">
    //           <i className="bi-list"></i>
    //         </span>
    //         <span className="navbar-toggler-toggled">
    //           <i className="bi-x"></i>
    //         </span>
    //       </button>

    //       <nav className="navbar-nav-wrap-col collapse navbar-collapse" id="navbarNavMenuLeftAligned">
    //         <ul className="navbar-nav">
    //           <li className="nav-item">
    //             <a className="nav-link active" href="#">Active</a>
    //           </li>

    //           <li className="nav-item dropdown">
    //             <a className="nav-link dropdown-toggle" href="#" id="navbarLeftAlignedDropdownSubMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</a>

    //             <div className="dropdown-menu" aria-labelledby="navbarLeftAlignedDropdownSubMenu" style={{ minWidth: "230px" }}>
    //               <a className="dropdown-item" href="#">Action</a>
    //               <a className="dropdown-item" href="#">Another action</a>
    //               <div className="dropdown-divider"></div>
    //               <a className="dropdown-item" href="#">Something else here</a>
    //             </div>
    //           </li>

    //           <li className="nav-item">
    //             <a className="nav-link dropdown-toggle" href="#" id="navbarLeftAlignedMegaMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">Mega menu</a>

    //             <div className="dropdown-menu w-100" aria-labelledby="navbarLeftAlignedMegaMenu">
    //               <div className="row">
    //                 <div className="col-lg-3 mb-3 mb-lg-0">
    //                   <span className="dropdown-header">One</span>

    //                   <a className="dropdown-item" href="#">One</a>
    //                   <a className="dropdown-item" href="#">Two</a>
    //                   <a className="dropdown-item" href="#">Three</a>
    //                 </div>

    //                 <div className="col-lg-3 mb-3 mb-lg-0">
    //                   <span className="dropdown-header">Two</span>

    //                   <a className="dropdown-item" href="#">One</a>
    //                   <a className="dropdown-item" href="#">Two</a>
    //                   <a className="dropdown-item" href="#">Three</a>
    //                 </div>

    //                 <div className="col-lg-3 mb-3 mb-lg-0">
    //                   <span className="dropdown-header">Three</span>

    //                   <a className="dropdown-item" href="#">One</a>
    //                   <a className="dropdown-item" href="#">Two</a>
    //                 </div>

    //                 <div className="col-lg-3">
    //                   <span className="dropdown-header">Four</span>

    //                   <a className="dropdown-item" href="#">One</a>
    //                   <a className="dropdown-item" href="#">Two</a>
    //                   <a className="dropdown-item" href="#">Three</a>
    //                 </div>
    //               </div>
    //             </div>
    //           </li>

    //           <li className="nav-item">
    //             <a className="nav-link" href="#">Link</a>
    //           </li>
    //         </ul>
    //       </nav>
    //     </div>
    //   </div>
    // </header>
  );

  // return (
  //   <header
  //     id="headerOnepagNav"
  //     //   className="header header-box-shadow left-aligned-navbar z-index-999" original
  //     //if z-index is present and you click on login button, it will appear in front of the menu
  //     //otheriwse begind it
  //     className="header header-box-shadow left-aligned-navbar z-index-999"
  //   >
  //     <div className="header-section">
  //       <div id="logoAndNavOnepagNav" className="container">
  //         <nav className="navbar navbar-expand-md w-md-100 w-100 d-inline-block">
  //           {/* this is logo in the up left corner of page */}
  //           <Link className="navbar-brand float-start" to="/home" aria-label="Front"
  //             style={{ width: "160px" }}>
  //             <img
  //               src="/logo.png"
  //               alt="Logo"
  //               style={{ minWidth: "148px", padding: "5px" }}
  //             />
  //           </Link>

  //           {/* <button
  //             type="button"
  //             className="navbar-toggler btn btn-icon btn-sm rounded-circle"
  //             aria-label="Toggle navigation"
  //             aria-expanded="false"
  //             aria-controls="navBarOnepagNav"
  //             data-toggle="collapse"
  //             data-target="#navBarOnepagNav"
  //           >
  //             <span className="navbar-toggler-default">
  //               <svg
  //                 width="14"
  //                 height="14"
  //                 viewBox="0 0 18 18"
  //                 xmlns="http://www.w3.org/2000/svg"
  //               >
  //                 <path
  //                   fill="currentColor"
  //                   d="M17.4,6.2H0.6C0.3,6.2,0,5.9,0,5.5V4.1c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,5.9,17.7,6.2,17.4,6.2z M17.4,14.1H0.6c-0.3,0-0.6-0.3-0.6-0.7V12c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,13.7,17.7,14.1,17.4,14.1z"
  //                 />
  //               </svg>
  //             </span>
  //             <span className="navbar-toggler-toggled">
  //               <svg
  //                 width="14"
  //                 height="14"
  //                 viewBox="0 0 18 18"
  //                 xmlns="http://www.w3.org/2000/svg"
  //               >
  //                 <path
  //                   fill="currentColor"
  //                   d="M11.5,9.5l5-5c0.2-0.2,0.2-0.6-0.1-0.9l-1-1c-0.3-0.3-0.7-0.3-0.9-0.1l-5,5l-5-5C4.3,2.3,3.9,2.4,3.6,2.6l-1,1 C2.4,3.9,2.3,4.3,2.5,4.5l5,5l-5,5c-0.2,0.2-0.2,0.6,0.1,0.9l1,1c0.3,0.3,0.7,0.3,0.9,0.1l5-5l5,5c0.2,0.2,0.6,0.2,0.9-0.1l1-1 c0.3-0.3,0.3-0.7,0.1-0.9L11.5,9.5z"
  //                 />
  //               </svg>
  //             </span>
  //           </button> */}

  //           <Button
  //             className="d-lg-none d-dm-inline-block navbar-toggler btn btn-icon btn-sm rounded-circle float-end"
  //             onClick={invokeCollapse}>
  //             <svg
  //               width="14"
  //               height="14"
  //               viewBox="0 0 18 18"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 fill="currentColor"
  //                 d="M17.4,6.2H0.6C0.3,6.2,0,5.9,0,5.5V4.1c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,5.9,17.7,6.2,17.4,6.2z M17.4,14.1H0.6c-0.3,0-0.6-0.3-0.6-0.7V12c0-0.4,0.3-0.7,0.6-0.7h16.9c0.3,0,0.6,0.3,0.6,0.7v1.4C18,13.7,17.7,14.1,17.4,14.1z"
  //               />
  //             </svg>
  //           </Button>

  //           <Collapse in={isVisible}>
  //             <div id="navBarOnepagNav" className="collapse navbar-collapse">
  //               {props.children}
  //             </div>
  //           </Collapse>
  //         </nav>
  //       </div>
  //     </div>

  //   </header>
  // );
};

export default Navbar;
