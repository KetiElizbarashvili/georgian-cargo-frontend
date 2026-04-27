import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import Leaflet from 'leaflet'
import ClientFooter from 'components/Footer/ClientFooter';

const About = () => {

  return (
    <>
      <main id="content" className="card mt-lg-0 mt-xl-8 mt-xxl-8 container bg-light pt-4" style={{ minWidth: "308px" }}>
        <div className="container ">
          <div className="mb-5 mb-md-10">
            <h1 className="display-4 text-center">About Us</h1>
            <div className="row">
              <div className="col-12 col-md-12 col-lg-5 col-sm-12 text-center">
                <img src="/oc-collaboration.png" className="img-fluid" width="350" style={{ color: "black" }} />
              </div>
              <div className="col-12 col-md-12 col-lg-7 col-sm-12">

                <p className="lead" style={{ fontSize: "16px" }}>
                  Founded in 2009, Georgian Cargo has been providing door-to-door courier services and air and sea freight forwarding services for over 14 years.
                  Our mission is to provide high-quality service and value for money through a range of top of the rage delivery services, air, sea and road.
                  We have grown steadily since our incorporation and are proud to facilitate shipments of over 220 thousand parcels, for more than 5,000.00 customers throughout the UK and Georgia, Ireland, Sweden, USA and Europe.
                  Our door-to-door courier services offer some of the most competitive rates for international parcel delivery, and we are unique among freight forwarders for the excellence of our customer service and the ease of getting in touch with an actual person.
                  However, we’re always striving to offer even better service! We know that, in order to meet our customers' expectations, we need to change continually. That's why we are always expanding the range of services we offer and adding new tools to make tracking and managing your orders easier than ever.
                  All of our services are fully bookable online and you can instantly and over the mobile application.

                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ClientFooter />
    </>
    //   <main id="content" role="main">
    //   <div classNameName="container content-space-t-3 content-space-t-lg-5 content-space-b-2 mt-4 mb-6">
    //   <div className="w-lg-75 text-center mx-lg-auto">

    //     </div>

    //   </div>

    //   {/* <div className="container content-space-2 content-space-lg-3">
    //     <div className="row justify-content-lg-center">
    //       <div className="col-sm-4 col-lg-3 mb-7 mb-sm-0">
    //         <div className="text-center">
    //           <h2 className="display-4">14</h2>
    //           <p className="small">years in business</p>
    //         </div>
    //       </div>

    //       <div className="col-sm-4 col-lg-3 mb-7 mb-sm-0">
    //         <div className="text-center">
    //           <h2 className="display-4">50k+</h2>
    //           <p className="small">parcels delivered</p>
    //         </div>
    //       </div>

    //       <div className="col-sm-4 col-lg-3">
    //         <div className="text-center">
    //           <h2 className="display-4">85%</h2>
    //           <p className="small">happy customers</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div> */}

    //   <div className="border-top mx-auto" style={{maxWidth: "25rem"}}></div>


    //   <div className="border-top mx-auto" style={{maxWidth: "25rem"}}></div>

    //   <ClientFooter />
    // </main>
  );
};

export default About;