import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import Leaflet from 'leaflet'
import ClientFooter from 'components/Footer/ClientFooter';
import { flagEmoji } from "../../utils/FlagEmoji";
import { toast } from "react-toastify";
import ContactForm from "./ContactForm";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const ContactUs = () => {
  const position = [41.73723910967565, 44.78430118463527]
  const iconHTML = ReactDOMServer.renderToString(<i className="bi bi-geo-alt-fill d-inline-block" style={{ fontSize: "40px", marginLeft: "-14px", marginTop: "-31px" }}></i>)
  const customMarkerIcon = new Leaflet.DivIcon({
    html: iconHTML,
  });



  return (
    <main id="content" role="main" style={{ minWidth: "308px" }} className="mt-lg-0 mt-xl-8 mt-xxl-8">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-9 mb-lg-0">
            <div className="mb-5">
              <h1>Get in touch</h1>
              <p>We'd love to talk about how we can help you.</p>
            </div>
            <div className="overflow-hidden">
              <MapContainer attributionControl={false} center={position} zoom={14} scrollWheelZoom={false} style={{ height: '50vh', width: '100wh', zIndex: "2" }}>
                <TileLayer
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customMarkerIcon}>
                </Marker>
              </MapContainer>
            </div>

            <div className="row mt-4">
              <div className="col-sm-7">
                <h5 className="mb-1">Call us:</h5>
                <ul>
                  <li className="row">
                    <div className="col-sm-2">{flagEmoji('UK')}</div>
                    <div className="col-sm-10"><a href="tel:+442036427952">+44 203 6427 952</a></div>
                  </li>
                  <li className="row">
                    <div className="col-sm-2">{flagEmoji('UK')}</div>
                    <div className="col-sm-10"><a href="tel:+447398295045">+44 739 8295 045</a></div>
                  </li>
                  <li className="row">
                    <div className="col-sm-2">{flagEmoji('GE')}</div>
                    <div className="col-sm-10"><a href="tel:+995322050884">+995 3 22 050 884</a></div>
                  </li>
                  <li className="row">
                    <div className="col-sm-2">{flagEmoji('GE')}</div>
                    <div className="col-sm-10"><a href="tel:+99579885826">+99 579 885 826</a></div>
                  </li>
                  <li className="row">
                    <div className="col-sm-2">{flagEmoji('IE')}</div>
                    <div className="col-sm-10"><a href="tel:+3530818000166">+353 08 1800 0166</a></div>
                  </li>
                  <li className="row">
                    <div className="col-sm-2">{flagEmoji('SE')}</div>
                    <div className="col-sm-10"><a href="tel:+46844687232">+46 8 4468 7232</a></div>
                  </li>
                </ul>
              </div>

              <div className="col-sm-5">
                <h5 className="mb-1">Email us:</h5>
                <a href="mailto:admin@georgiancargo.co.uk">admin@georgiancargo.co.uk</a>
                <h5 className="mb-1 mt-2">Georgian Address:</h5>
                <a className="link-sm link-primary" href="https://goo.gl/maps/Pzdwn7sdzSNy4zAW7"><i className="bi-geo-alt-fill me-1"></i>&nbsp;25 Nadira Khosharauli Street, street,  0119, Tbilisi, Georgia</a>
                <h5 className="mb-1 mt-2">UK Address:</h5>
                <a className="link-sm link-primary" href="https://g.page/GergianCargo?share"><i className="bi-geo-alt-fill me-1"></i>&nbsp; Georgian Cargo, (Safe Store), 105 Mayes Rd, London N22 6UP</a>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <ContactForm selectedEnquery={"General"} />
          </div>
        </div>
      </div>
      <ClientFooter />
    </main>
  );
};

export default ContactUs;