import React, { useState, useContext, useEffect } from 'react';

import { EmailSignupForm } from "components/EmailSignupForm";
import { ClientFooter } from "components/Footer";
import ItemsTable from "components/ItemsTable/ItemsTable";
import TransactionsTable from "components/TransactionsTable/TransactionsTable";
import { testimonials } from "utils";
import SlickSlider from "react-slick";
import PublicTrackingModal from "./PublicTrackingModal";
import Collapse from 'react-bootstrap/Collapse';
import { Link, useLocation, useHistory, useRouteMatch } from "react-router-dom";
import clientAddress from "requests/clientAddress";
import useRequest from "hooks/useRequest";
import { AuthContext } from "context";
import * as d3 from 'd3';
import * as topojson from "topojson";
import axios from 'axios';
import { useCookies } from "react-cookie";
import moment from "moment";
import getRoutes from "requests/getRoutes"
import getRoutePairs from "requests/getRoutePairs";
import countryListAllIsoData from 'utils/CountryList'
import Steps from "components/BookCourier/Steps";
import { PublicPriceCalculator } from 'components/PublicPriceCalculator';
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const HomePage = () => {
  const [loyaltyModalShow, setLoyaltyModalShow] = useState(true);
  const closeModal = () => setLoyaltyModalShow(false);

  return (
    <>
      <main id="content" role="main" className="bg-light gc-landing" style={{ minWidth: "308px" }}>
        <div className="py-2 pt-11">
          <Hero />
        </div>
        <div className="space-1">
          <Features />
        </div>
        <div className="space-2">
          <Testimonials />
        </div>
        <div className="space-1">
          <Stats />
        </div>
        <div className="space-2">
          <Articles />
        </div>
        {(window.location.pathname !== '/home/register' && window.location.pathname !== '/home/login') && (
          <Modal
            show={loyaltyModalShow}
            centered
            onHide={closeModal}
            size="lg"
            aria-labelledby="referral-program-modal-title"
            dialogClassName="gc-referral-modal"
          >
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title id="referral-program-modal-title" className="gc-referral-modal__title">
                Referral Program
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
              <div className="gc-referral-modal__content">
                <div className="gc-referral-modal__visual">
                  <img
                    className="gc-referral-modal__image"
                    src="/images/undraw_gift_re_qr17.svg"
                    width="300"
                    height="300"
                    alt="Referral gift illustration"
                  />
                </div>
                <div className="gc-referral-modal__copy">
                  <p className="gc-referral-modal__eyebrow">New</p>
                  <h4 className="mb-3">Earn points and save on future deliveries</h4>
                  <p className="mb-3">
                    Invite friends, collect referral points, and convert those points into coupons you can apply to your parcels.
                  </p>
                  <ul className="gc-referral-modal__benefits">
                    <li>Share your referral code from Loyalty page</li>
                    <li>Receive points when invited users register</li>
                    <li>Redeem points for parcel discounts</li>
                  </ul>
                  <small className="text-muted">
                    You can manage everything from your Loyalty page in profile.
                  </small>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="gc-referral-modal__footer border-0 pt-0">
              <Button variant="outline-secondary" onClick={closeModal}>
                Maybe later
              </Button>
              <Button as={Link} to="/dashboard/loyalty" variant="primary" onClick={closeModal}>
                Open Loyalty
              </Button>
            </Modal.Footer>
          </Modal>
        )}

      </main>
      {/* <TransactionsTable /> */}
      <ClientFooter />
    </>
  );
};
const ShipmentCard = ({ icon, name, from, price }) => (
  <article className="gc-shipment-card">
    <div className="gc-shipment-card__icon-wrap">
      <i className={`${icon} gc-shipment-card__icon`} aria-hidden="true"></i>
    </div>
    <div className="gc-shipment-card__body">
      <h4 className="gc-shipment-card__name">{name}</h4>
      <p className="gc-shipment-card__route">
        <i className="bi bi-geo-alt" aria-hidden="true"></i>
        {from} <span aria-hidden="true">→</span> Georgia
      </p>
      <p className="gc-shipment-card__price">
        {price} <span className="gc-shipment-card__vat">+ VAT</span>
      </p>
    </div>
  </article>
);

const Hero = () => {
  const match = useRouteMatch();
  const { auth, setAuth } = useContext(AuthContext);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showChooseSourceCountryModal, setShowChooseSourceCountryModal] = useState(false);
  const [getClientAddress] = useRequest(clientAddress);
  const [ipData, setIpData] = useState('');
  const { hash } = useLocation();
  const [cookies, setCookie] = useCookies(['originCountry']);
  const [destinationCountry, setDestinationCountry] = useState("GE");
  const [sourceCountry, setSourceCountry] = useState('UK');
  const [getRoutesData] = useRequest(getRoutes);
  const [getRoutePairsData] = useRequest(getRoutePairs);
  const [allRoutesData, setAllRoutesData] = useState('');
  const [routePairs, setRoutePairs] = useState([]);
  const history = useHistory();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    if (auth.user) {
      setSourceCountry(cookies.sourceCountry ?? cookies.originCountry);
    }
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, false);
  }, [auth.user]);

  const openChooseSourceCountryModal = () => {
    setShowChooseSourceCountryModal(true);
  };

  const closeChooseSourceCountryModal = () => {
    setShowChooseSourceCountryModal(false);
  };


  const getData = async () => {
    const res = await axios.get('http://ip-api.com/json/?fields=status,message,country,countryCode')
    setIpData(res.data)
    setCookie('originCountry', (res.data.countryCode === 'GB' ? 'UK' : res.data.countryCode), { path: "/", expires: moment().add(7, "days").toDate() });
  }


  const redirectToBooking = () => {
    // if (auth?.sourceCountry === '' || auth?.sourceCountry === 'null' || auth?.sourceCountry === null) {
    //   window.location.href = '/home/login?n=book'
    //   // getClientAddress()
    //   //   .then((response) => {
    //   //     if (response.data.addresses !== undefined) {
    //   //       setAuth({
    //   //         ...auth,
    //   //         sourceCountry: response.data.addresses[0].address_country_code || cookies.originCountry
    //   //       });
    //   //     }
    //   //   }).then(() => setShowChooseSourceCountryModal(true));
    // }
    // else {
    //   // return <Redirect to={"/dashboard/book-a-courier/" + auth.sourceCountry.toUpperCase()} />
    //   // setShowChooseSourceCountryModal(true);
    // }
    // return;

    if (auth?.accountType === 'ADMIN') {
      toast.error("To book please log out from staff account.");
      return;
    }
    if (auth?.isLoggedIn) {
      window.location.href = "/book-a-courier/" + (auth?.sourceCountry?.toUpperCase()) + '/' + destinationCountry;
    } else {
      window.location.href = "/book-a-courier/" + (sourceCountry) + '/' + destinationCountry;
    }
  };


  const css = `
  .collapsing {
    transition: none !important;
  }
`
  useEffect(() => {
    if (cookies.originCountry === undefined) {
      getData();
    }
    if (cookies.allRoutes === undefined || cookies.allRoutes === 'undefined') {
      getRoutesData().then((r) => {
        const routes = r?.data?.routes;
        if (Array.isArray(routes) && routes.length > 0) {
          setCookie('allRoutes', JSON.stringify(routes), { path: "/", expires: moment().add(1, "days").toDate() });
          setAllRoutesData(countryListAllIsoData.filter(obj =>
            routes.map(a => a.code).includes(obj.value)
          ));
        }
      });
    }
    else {
      try {
        const cached = typeof cookies.allRoutes === 'string'
          ? JSON.parse(cookies.allRoutes)
          : cookies.allRoutes;
        if (Array.isArray(cached)) {
          setAllRoutesData(countryListAllIsoData.filter(obj =>
            cached.map(a => a.code).includes(obj.value)
          ));
        }
      } catch (e) {
        // stale/corrupt cookie — refetch on next render
      }
    }
    getRoutePairsData().then((r) => {
      if (Array.isArray(r?.data?.pairs)) setRoutePairs(r.data.pairs);
    });

    // var width = 500,
    //   height = 500,
    //   speed = -1e-2,
    //   start = Date.now();

    // var sphere = { type: "Sphere" };

    // var projection = d3.geo
    //   .orthographic()
    //   .scale(width / 2.1)
    //   .translate([width / 2, height / 2])
    //   .precision(0.5);

    // var graticule = d3.geo.graticule();

    // var canvas = d3
    //   .select("#earth")
    //   .append("canvas")
    //   .attr("width", width)
    //   .attr("height", height);

    // var context = canvas.node().getContext("2d");

    // var path = d3.geo.path().projection(projection).context(context);

    // d3.json("/world-110m.json",
    //   function (error, topo) {
    //     if (error) throw error;

    //     var land = topojson.feature(topo, topo.objects.land),
    //       grid = graticule();

    //     var usa = {
    //       "type": "FeatureCollection", "features": [
    //         { "type": "Feature", "geometry": { "type": "MultiPolygon", "coordinates": [[[[-94.81758, 49.38905], [-88.378114, 48.302918], [-82.550925, 45.347517], [-82.439278, 41.675105], [-71.50506, 45.0082], [-69.237216, 47.447781], [-66.96466, 44.8097], [-70.11617, 43.68405], [-70.64, 41.475], [-73.982, 40.628], [-75.72205, 37.93705], [-75.72749, 35.55074], [-81.49042, 30.72999], [-80.056539, 26.88], [-81.17213, 25.20126], [-83.70959, 29.93656], [-89.18049, 30.31598], [-94.69, 29.48], [-99.02, 26.37], [-100.9576, 29.38071], [-104.45697, 29.57196], [-106.50759, 31.75452], [-111.02361, 31.33472], [-117.12776, 32.53534], [-120.36778, 34.44711], [-123.7272, 38.95166], [-124.53284, 42.76599], [-124.68721, 48.184433], [-122.84, 49], [-116.04818, 49], [-107.05, 49], [-100.65, 49], [-94.81758, 49.38905]]], [[[-155.06779, 71.147776], [-140.985988, 69.711998], [-140.99777, 60.306397], [-148.018066, 59.978329], [-157.72277, 57.570001], [-166.121379, 61.500019], [-164.562508, 63.146378], [-168.11056, 65.669997], [-161.908897, 70.33333], [-155.06779, 71.147776]]]] }, "properties": { "name": "United States of America" }, "id": "USA" }
    //       ]
    //     };

    //     var circumference = 6371000 * Math.PI * 2;
    //     var angle = 1000000 / circumference * 360;

    //     var circle = d3.geoCircle().center([-100, 40]).radius(angle);

    //     d3.timer(function () {
    //       context.clearRect(0, 0, width, height);

    //       projection.rotate([speed * (Date.now() - start), -15]).clipAngle(90);

    //       context.beginPath();
    //       path(sphere);
    //       context.lineWidth = 0;
    //       context.strokeStyle = "transparent";
    //       context.stroke();
    //       context.fillStyle = "transparent";
    //       context.fill();

    //       projection.clipAngle(180);

    //       context.beginPath();
    //       path(land);
    //       context.fillStyle = "rgb(232, 196, 110)";
    //       context.fill();

    //       context.beginPath();
    //       path(grid);
    //       context.lineWidth = 0.5;
    //       context.strokeStyle = "rgba(119,119,119,0)";
    //       context.stroke();

    //       projection.clipAngle(90);

    //       context.beginPath();
    //       path(land);
    //       context.fillStyle = "#1CA3DD";
    //       context.fill();
    //       context.lineWidth = 0;
    //       context.strokeStyle = "transparent";
    //       context.stroke();
    //     });
    //   }
    // );
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const earthNode = document.getElementById("earth");
    if (!earthNode) return;

    const locations = [
      { lat: 59.3293, lon: 18.0686, countryCode: "SE", flag: "🇸🇪", label: "Sweden" },
      { lat: 53.3498, lon: -6.2603, countryCode: "IE", flag: "🇮🇪", label: "Ireland" },
      { lat: 51.5072, lon: -0.1276, countryCode: "GB", flag: "🇬🇧", label: "UK" },
      { lat: 40.1872, lon: 44.5152, countryCode: "AM", flag: "🇦🇲", label: "Armenia" },
      { lat: 41.6938, lon: 44.8015, countryCode: "GE", flag: "🇬🇪", label: "Georgia" },
    ];

    // Use a stable viewBox so the SVG scales with CSS without JS resize logic.
    const VW = 500, VH = 380;
    const cx = VW / 2, cy = VH / 2;
    const globeScale = 170;
    const markerR = 15;
    const TILT = -12;
    const AUTO_SPEED = 0.012; // degrees per ms

    const projection = d3
      .geoOrthographic()
      .scale(globeScale)
      .translate([cx, cy])
      .clipAngle(90)
      .rotate([-25, TILT]);

    const path = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule10();

    const isVisible = (loc) =>
      d3.geoDistance([loc.lon, loc.lat], projection.invert([cx, cy])) < Math.PI / 2 + 0.05;

    const svg = d3.select("#earth")
      .append("svg")
      .attr("viewBox", `0 0 ${VW} ${VH}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%");

    // ── Defs ──────────────────────────────────────────────────────────────────
    const defs = svg.append("defs");

    defs.append("radialGradient")
      .attr("id", "gc-globe-ocean")
      .attr("cx", "38%").attr("cy", "35%").attr("r", "62%")
      .selectAll("stop")
      .data([
        { offset: "0%",   color: "#f5faff" },
        { offset: "55%",  color: "#c8e3f5" },
        { offset: "100%", color: "#a8cfe8" },
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Subtle ambient glow behind the sphere
    const glow = defs.append("filter").attr("id", "gc-globe-glow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
    glow.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "blur");
    glow.append("feComposite").attr("in", "SourceGraphic").attr("in2", "blur").attr("operator", "over");

    const shadow = defs.append("filter").attr("id", "gc-globe-shadow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "150%");
    shadow.append("feDropShadow").attr("dx", 0).attr("dy", 8).attr("stdDeviation", 10).attr("flood-color", "#0f172a").attr("flood-opacity", 0.22);

    // ── Layers ────────────────────────────────────────────────────────────────
    // Outer glow circle
    svg.append("circle")
      .attr("cx", cx).attr("cy", cy).attr("r", globeScale + 4)
      .attr("fill", "rgba(28,163,221,0.07)")
      .attr("filter", "url(#gc-globe-glow)");

    const spherePath = svg.append("path")
      .datum({ type: "Sphere" })
      .attr("fill", "url(#gc-globe-ocean)")
      .attr("stroke", "#6fa8cc")
      .attr("stroke-width", 0.8)
      .attr("filter", "url(#gc-globe-shadow)");

    const graticulePath = svg.append("path")
      .datum(graticule)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.28)")
      .attr("stroke-width", 0.5);

    let countryPaths = null;
    let markersReady = false;

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((data) => {
        countryPaths = svg.selectAll(".gc-country")
          .data(topojson.feature(data, data.objects.countries).features)
          .enter().append("path")
          .attr("class", "gc-globe-path--country")
          .attr("fill", "#1ca3dd")
          .attr("stroke", "rgba(255,255,255,0.65)")
          .attr("stroke-width", 0.4);
        // Raise markers above countries once countries are painted
        markerLayer.raise();
        markersReady = true;
      })
      .catch(() => { /* decorative — fail silently */ });

    const markerLayer = svg.append("g").attr("class", "gc-globe-markers");
    const markerNodes = markerLayer.selectAll(".gc-globe-marker")
      .data(locations).enter()
      .append("g").attr("class", "gc-globe-marker");

    // Pulse halo
    markerNodes.append("circle").attr("class", "gc-globe-marker__halo").attr("r", markerR + 4);
    // White background disk so emoji shows on any globe color
    markerNodes.append("circle").attr("r", markerR).attr("fill", "#fff").attr("stroke", "#dbeafe").attr("stroke-width", 1.2);
    // Emoji flag — always renders
    markerNodes.append("text")
      .attr("class", "gc-globe-marker__emoji")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", markerR * 1.35)
      .text(d => d.flag);
    // Country code label below the bubble
    markerNodes.append("text")
      .attr("class", "gc-globe-marker__code")
      .attr("text-anchor", "middle")
      .attr("y", markerR + 10)
      .text(d => d.countryCode);

    // ── Render ────────────────────────────────────────────────────────────────
    const render = () => {
      spherePath.attr("d", path({ type: "Sphere" }));
      graticulePath.attr("d", path(graticule));
      if (countryPaths) countryPaths.attr("d", path);
      markerNodes
        .attr("display", d => isVisible(d) ? null : "none")
        .attr("transform", d => {
          const [x, y] = projection([d.lon, d.lat]);
          return `translate(${x},${y})`;
        });
      if (markersReady) markerLayer.raise();
    };

    // ── Auto-rotation ─────────────────────────────────────────────────────────
    let autoRotate = true;
    let startTime = Date.now();
    let baseRotation = -25;

    const timer = d3.timer(() => {
      if (!autoRotate) return;
      const elapsed = Date.now() - startTime;
      projection.rotate([baseRotation + AUTO_SPEED * elapsed, TILT]);
      render();
    });

    // ── Drag to spin ──────────────────────────────────────────────────────────
    let dragStart = null;
    let rotAtDragStart = null;

    const drag = d3.drag()
      .on("start", (event) => {
        autoRotate = false;
        timer.stop();
        dragStart = [event.x, event.y];
        rotAtDragStart = projection.rotate().slice();
      })
      .on("drag", (event) => {
        const dx = event.x - dragStart[0];
        const dy = event.y - dragStart[1];
        const sensitivity = 0.3;
        projection.rotate([
          rotAtDragStart[0] + dx * sensitivity,
          Math.max(-60, Math.min(60, rotAtDragStart[1] - dy * sensitivity)),
        ]);
        render();
      })
      .on("end", () => {
        // Resume auto-rotation smoothly from current position
        baseRotation = projection.rotate()[0];
        startTime = Date.now();
        autoRotate = true;
        timer.restart(() => {
          if (!autoRotate) return;
          const elapsed = Date.now() - startTime;
          projection.rotate([baseRotation + AUTO_SPEED * elapsed, TILT]);
          render();
        });
      });

    svg.call(drag).style("cursor", "grab");

    render(); // initial paint

    return () => {
      timer.stop();
      d3.select("#earth").selectAll("svg").remove();
    };
  }, []);



  return (
    <div className="container">
      <style>{css}</style>

      <div className="border-bottom">
        <div className="w-lg-100 text-center mx-lg-auto">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <div className="gc-hero">
            {/* Left: copy + search */}
            <div className="gc-hero__left">
              <h1 className="gc-hero__title">
                Global shipments to<br />
                <span className="gc-hero__title-accent">GEORGIA</span>
              </h1>

              <p className="gc-hero__sub">Fast, reliable cargo delivery from Europe &amp; beyond.</p>

              {/* Tracking */}
              <Collapse in={hash === '#tracking' || (match.params.tracking && !match.params.tracking.match(/^[a-z]+$/))}>
                <div id="tracking-colapse" className="mb-4">
                  <PublicTrackingModal />
                </div>
              </Collapse>

              {/* Booking bar */}
              <Collapse in={hash === '#booking' || hash === ''}>
                <div id="booking-colapse" className="mb-4">
                  {auth?.isLoggedIn === true && (auth?.sourceCountry === '' || auth?.sourceCountry === 'null') && (
                    <small className='text-danger d-block w-100 text-start mb-2'>
                      Please <Link to={"/dashboard/address"} className="text-danger fw-bold">enter</Link> your address in dashboard.
                    </small>
                  )}
                  <div className="gc-booking-bar">
                    <div className="gc-booking-bar__field">
                      <span className="gc-booking-bar__icon"><i className="bi bi-geo-alt-fill"></i></span>
                      <div className="gc-booking-bar__label">From</div>
                      <select
                        disabled={auth.isLoggedIn === true && auth?.accountType === 'CLIENT'}
                        value={sourceCountry}
                        onChange={(e) => setSourceCountry(e.target.value)}
                        className="gc-booking-bar__select"
                        aria-label="Source country"
                      >
                        {Object.getOwnPropertyNames(Steps).map((st) => (
                          <option key={st} value={st.toUpperCase()}>
                            {windowWidth < 400
                              ? countryListAllIsoData.find(x => x.value === st.toUpperCase()).value
                              : countryListAllIsoData.find(x => x.value === st.toUpperCase()).label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="gc-booking-bar__divider"><i className="bi bi-arrow-right"></i></div>

                    <div className="gc-booking-bar__field">
                      <span className="gc-booking-bar__icon gc-booking-bar__icon--dest"><i className="bi bi-geo-fill"></i></span>
                      <div className="gc-booking-bar__label">To</div>
                      <select
                        disabled={allRoutesData === ''}
                        value={destinationCountry}
                        onChange={(e) => setDestinationCountry(e.target.value)}
                        className="gc-booking-bar__select"
                        aria-label="Destination country"
                      >
                        {allRoutesData === '' && <option>Loading...</option>}
                        {allRoutesData && allRoutesData.map((rt) => (
                          <option key={rt.value} value={rt.value}>
                            {windowWidth < 400 ? rt.value : rt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button className="gc-booking-bar__btn" type="button" onClick={redirectToBooking}>
                      <i className="bi bi-search me-2"></i>Book Now
                    </button>
                  </div>
                </div>
              </Collapse>

              {/* App store buttons */}
              <div className="gc-appstore-btns">
                <button className="gc-appstore-btn">
                  <svg className="gc-appstore-btn__icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="gc-appstore-btn__text">
                    <small>Download on the</small>
                    <strong>App Store</strong>
                  </span>
                </button>
                <button className="gc-appstore-btn">
                  <svg className="gc-appstore-btn__icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.65.19.97.08l.1-.06 11.05-6.37-2.38-2.39-9.74 8.74zM.64 1.67C.24 2.03 0 2.58 0 3.28v17.45c0 .7.24 1.25.64 1.6l.08.08 9.77-9.77v-.22L.72 1.59l-.08.08zM20.9 10.51l-2.81-1.62-2.65 2.65 2.65 2.65 2.84-1.64c.81-.47.81-1.23-.03-1.04zM4.15.24L15.2 6.61 12.82 9 3.08.26l.07-.02z"/>
                  </svg>
                  <span className="gc-appstore-btn__text">
                    <small>Get it on</small>
                    <strong>Google Play</strong>
                  </span>
                </button>
              </div>
            </div>

            {/* Right: globe (desktop/tablet only) */}
            <div className="gc-hero__right d-none d-md-flex">
              <div id="earth" className="gc-hero__globe" aria-hidden="true"></div>
            </div>
          </div>
          {/* ── /Hero ────────────────────────────────────────────────── */}

          <section className="gc-dashboard-highlight" aria-labelledby="gc-dashboard-highlight-title">
            <div className="gc-dashboard-highlight__copy">
              <p className="gc-dashboard-highlight__eyebrow">Customer Portal</p>
              <h2 id="gc-dashboard-highlight-title" className="gc-dashboard-highlight__title">
                Personal Dashboard
              </h2>
              <p className="gc-dashboard-highlight__description">
                See and manage all your shipments in one place on desktop and mobile.
              </p>
              <ul className="gc-dashboard-highlight__list">
                <li>Track every parcel from booking to delivery</li>
                <li>Check shipment history and live statuses</li>
                <li>Manage bookings and profile details faster</li>
              </ul>
              <div className="gc-dashboard-highlight__actions">
                <Link to="/home/register" className="gc-dashboard-highlight__btn gc-dashboard-highlight__btn--primary">
                  Create account
                </Link>
                <Link to="/home/login" className="gc-dashboard-highlight__btn gc-dashboard-highlight__btn--secondary">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="gc-dashboard-highlight__media">
              <div className="hero-banner-wrapper">
                <picture>
                  <source srcSet="/responsive-example.webp" type="image/webp" />
                  <img
                    src="/responsive-example.png"
                    className="img-fluid gc-dashboard-highlight__image"
                    fetchpriority="high"
                    width="760"
                    height="480"
                    alt="Personal Dashboard on laptop and mobile"
                  />
                </picture>
              </div>
            </div>
          </section>


          <hr />

          <section className="gc-delivery-section" aria-labelledby="gc-delivery-title">
            <div className="gc-delivery-section__head">
              <p className="gc-delivery-section__eyebrow">How It Works</p>
              <h2 id="gc-delivery-title" className="gc-delivery-section__title">Discount Parcel Delivery</h2>
              <p className="gc-delivery-section__subtitle">
                Sending parcels and pallets online should be easy. We made the booking process fast, clear, and simple.
              </p>
            </div>

            <div className="gc-delivery-cards">

              {/* Step 1 */}
              <article className="gc-delivery-card">
                <div className="gc-delivery-card__icon-wrap gc-delivery-card__icon-wrap--blue">
                  <span className="gc-delivery-card__step">01</span>
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="gc-delivery-card__icon">
                    <circle cx="24" cy="22" r="9" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                    <path d="M24 4C15.163 4 8 11.163 8 20c0 12.418 14.244 23.164 15.03 23.736a1.5 1.5 0 0 0 1.94 0C25.756 43.164 40 32.418 40 20c0-8.837-7.163-16-16-16z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                    <circle cx="24" cy="22" r="4" fill="currentColor" opacity="0.25"/>
                  </svg>
                </div>
                <div className="gc-delivery-card__body">
                  <h4 className="gc-delivery-card__title">Enter Destination</h4>
                  <p className="gc-delivery-card__text">
                    Choose where your parcel needs to go and we guide you through every step to Georgia or elsewhere.
                  </p>
                </div>
              </article>

              <div className="gc-delivery-connector" aria-hidden="true">
                <svg viewBox="0 0 40 16" fill="none">
                  <path d="M0 8 H32 M28 4 L36 8 L28 12" stroke="#c7d9ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Step 2 */}
              <article className="gc-delivery-card">
                <div className="gc-delivery-card__icon-wrap gc-delivery-card__icon-wrap--teal">
                  <span className="gc-delivery-card__step">02</span>
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="gc-delivery-card__icon">
                    <path d="M8 14h32M8 22h20M8 30h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <rect x="6" y="8" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                    <circle cx="36" cy="34" r="7" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M33 34l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="gc-delivery-card__body">
                  <h4 className="gc-delivery-card__title">Great Service</h4>
                  <p className="gc-delivery-card__text">
                    Compare services by price, delivery speed, and convenience to choose the best option for your shipment.
                  </p>
                </div>
              </article>

              <div className="gc-delivery-connector" aria-hidden="true">
                <svg viewBox="0 0 40 16" fill="none">
                  <path d="M0 8 H32 M28 4 L36 8 L28 12" stroke="#c7d9ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Step 3 */}
              <article className="gc-delivery-card">
                <div className="gc-delivery-card__icon-wrap gc-delivery-card__icon-wrap--violet">
                  <span className="gc-delivery-card__step">03</span>
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="gc-delivery-card__icon">
                    <rect x="6" y="14" width="36" height="24" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M6 22h36" stroke="currentColor" strokeWidth="2.5"/>
                    <rect x="12" y="28" width="8" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                    <path d="M28 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 9 L24 14 L32 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="gc-delivery-card__body">
                  <h4 className="gc-delivery-card__title">Book Online</h4>
                  <p className="gc-delivery-card__text">
                    Complete your booking in minutes and pay securely with your card through Stripe.
                  </p>
                </div>
              </article>

            </div>
          </section>

          <hr className='mt-8 mb-8' />

          <section className="gc-diff" aria-labelledby="gc-diff-title">
            {/* Left column — copy + stats */}
            <div className="gc-diff__left">
              <p className="gc-diff__eyebrow">Why Customers Choose Us</p>
              <h2 id="gc-diff-title" className="gc-diff__title">We Make a<br />Difference</h2>
              <p className="gc-diff__subtitle">
                Customer service is our focus. Our team is trained across every service we offer — reach us by phone, email, or live chat any time.
              </p>

              <div className="gc-diff__stats">
                <div className="gc-diff__stat">
                  <span className="gc-diff__stat-value">15+</span>
                  <span className="gc-diff__stat-label">Years of experience</span>
                </div>
                <div className="gc-diff__stat">
                  <span className="gc-diff__stat-value">20K+</span>
                  <span className="gc-diff__stat-label">Parcels delivered</span>
                </div>
                <div className="gc-diff__stat">
                  <span className="gc-diff__stat-value">4</span>
                  <span className="gc-diff__stat-label">Countries served</span>
                </div>
              </div>
            </div>

            {/* Right column — feature cards */}
            <div className="gc-diff__right">
              {[
                {
                  color: "blue",
                  title: "Great Prices",
                  desc: "Competitive rates on every route — no hidden fees, ever.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <path d="M20 8v24M14 14h9a3 3 0 0 1 0 6h-6a3 3 0 0 0 0 6h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  color: "teal",
                  title: "Excellent Customer Service",
                  desc: "Friendly support staff available whenever you need help.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <path d="M10 22v-4a10 10 0 1 1 20 0v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                      <rect x="8" y="21" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="2.2"/>
                      <rect x="27" y="21" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="2.2"/>
                      <path d="M32 29v2a4 4 0 0 1-4 4h-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  color: "violet",
                  title: "Wide Range of Services",
                  desc: "Parcels, pallets, containers — we cover every shipment type.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <rect x="6" y="14" width="28" height="18" rx="3" stroke="currentColor" strokeWidth="2.2"/>
                      <path d="M13 14V11a7 7 0 0 1 14 0v3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                      <circle cx="20" cy="23" r="3" stroke="currentColor" strokeWidth="2.2"/>
                    </svg>
                  ),
                },
                {
                  color: "amber",
                  title: "Live Tracking",
                  desc: "Proactive notifications so you always know where your shipment is.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <circle cx="20" cy="17" r="6" stroke="currentColor" strokeWidth="2.2"/>
                      <path d="M20 11V7M20 27v-4M26 17h4M10 17h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                      <path d="M20 23c0 4-6 10-6 10h12s-6-6-6-10z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  color: "rose",
                  title: "Multi-Channel Support",
                  desc: "Telephone, email, and live chat — choose whatever suits you.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <path d="M8 12h24a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2.2"/>
                      <path d="M6 14l14 9 14-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  ),
                },
              ].map(({ color, title, desc, icon }) => (
                <div key={title} className={`gc-diff__card gc-diff__card--${color}`}>
                  <div className="gc-diff__card-icon">{icon}</div>
                  <div className="gc-diff__card-body">
                    <p className="gc-diff__card-title">{title}</p>
                    <p className="gc-diff__card-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className='mt-8 mb-8' />

          <section className="gc-popular-shipments" aria-labelledby="gc-popular-shipments-title">
            <div className="gc-popular-shipments__head">
              <p className="gc-popular-shipments__eyebrow">Trending</p>
              <h2 id="gc-popular-shipments-title" className="gc-popular-shipments__title">Popular Shipments</h2>
              <p className="gc-popular-shipments__subtitle">Example prices of what others have sent with us</p>
            </div>

            <div className="gc-popular-shipments__body">
              {/* Tab pills */}
              <ul className="gc-popular-shipments__tabs nav nav-pills" id="myTab" role="tablist">
                {[
                  { id: "hoit", label: "Household Items", icon: "bi-house-door" },
                  { id: "spoequ", label: "Sports Equipment", icon: "bi-bicycle" },
                  { id: "furni", label: "Furniture", icon: "bi-lamp" },
                  { id: "elect", label: "Electronics", icon: "bi-cpu" },
                ].map(({ id, label, icon }, i) => (
                  <li className="nav-item" key={id} role="presentation">
                    <button
                      className={`gc-popular-shipments__tab-btn${i === 0 ? " active" : ""}`}
                      id={`${id}-tab`}
                      data-bs-toggle="tab"
                      data-bs-target={`#${id}`}
                      type="button"
                      role="tab"
                      aria-controls={id}
                      aria-selected={i === 0}
                    >
                      <i className={`bi ${icon}`} aria-hidden="true"></i>
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tab panels */}
              <div className="tab-content gc-popular-shipments__panels" id="myTabContent">

                {/* Household */}
                <div className="tab-pane fade show active" id="hoit" role="tabpanel" aria-labelledby="hoit-tab">
                  <div className="gc-shipment-grid">
                    {[
                      { icon: "fas fa-tv", name: "Television", from: "United Kingdom", price: "£40.16" },
                      { icon: "fas fa-door-closed", name: "Smeg Fridge", from: "Ireland", price: "£187.22" },
                      { icon: "fas fa-guitar", name: "Guitar", from: "United Kingdom", price: "£55.55" },
                    ].map((item) => (
                      <ShipmentCard key={item.name} {...item} />
                    ))}
                  </div>
                </div>

                {/* Sports */}
                <div className="tab-pane fade" id="spoequ" role="tabpanel" aria-labelledby="spoequ-tab">
                  <div className="gc-shipment-grid">
                    {[
                      { icon: "fas fa-bicycle", name: "Electric Scooter", from: "United Kingdom", price: "£52.98" },
                      { icon: "fas fa-bicycle", name: "Bike", from: "Ireland", price: "£143.96" },
                      { icon: "fas fa-running", name: "Treadmill", from: "United Kingdom", price: "£55.55" },
                    ].map((item) => (
                      <ShipmentCard key={item.name} {...item} />
                    ))}
                  </div>
                </div>

                {/* Furniture */}
                <div className="tab-pane fade" id="furni" role="tabpanel" aria-labelledby="furni-tab">
                  <div className="gc-shipment-grid">
                    {[
                      { icon: "fas fa-chair", name: "Small Furniture", from: "United Kingdom", price: "£31.62" },
                      { icon: "fas fa-couch", name: "Table", from: "Ireland", price: "£399.14" },
                      { icon: "fas fa-desktop", name: "Desktop Monitor", from: "United Kingdom", price: "£5.85" },
                    ].map((item) => (
                      <ShipmentCard key={item.name} {...item} />
                    ))}
                  </div>
                </div>

                {/* Electronics */}
                <div className="tab-pane fade" id="elect" role="tabpanel" aria-labelledby="elect-tab">
                  <div className="gc-shipment-grid">
                    {[
                      { icon: "fas fa-tv", name: "Projector", from: "United Kingdom", price: "£46.15" },
                      { icon: "fas fa-laptop", name: "Laptop", from: "Ireland", price: "£35.89" },
                      { icon: "fas fa-mobile-alt", name: "Mobile Phone", from: "United Kingdom", price: "£23.92" },
                    ].map((item) => (
                      <ShipmentCard key={item.name} {...item} />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
          <hr className='mt-8 mb-8' />
          {allRoutesData && (
            <>
              <PublicPriceCalculator allRoutesData={allRoutesData} routePairs={routePairs} redirectToBooking={redirectToBooking} />
            </>
          )}


          {/* 
          <div className="w-lg-100 mx-lg-auto">
            <div className="d-flex">
              <div className="w-50">
                <img
                  className="img-fluid"
                  src="/images/undraw_Container_ship_ok1c.png"
                  alt="Description"
                />
              </div>
              <div className="w-50">
                <img
                  className="img-fluid"
                  src="/images/undraw_deliveries_131a.png"
                  alt="Description"
                />
              </div>
            </div>
          </div> */}
        </div>
      </div >
    </div >

  );
};
const Features = () => {
  return (
    <></>
    // <div className="container">
    //   <div className="row">
    //     <div className="col-lg-5 mb-7 mb-lg-0">
    //       <div className="mb-4">
    //         <h2 className="h1">All-in-one</h2>
    //       </div>

    //       <p>
    //         Georgian cargo is a place where shopping happen, savings are made,
    //         and information is always at your fingertips.
    //       </p>
    //     </div>
    //   </div>

    //   <div className="mt-lg-n11 mb-7 mb-lg-0">
    //     <figure className="ie-device-and-mobile">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         xmlnsXlink="http://www.w3.org/1999/xlink"
    //         x="0px"
    //         y="0px"
    //         viewBox="0 0 2058.5 1182.2"
    //         xmlSpace="preserve"
    //       >
    //         <path
    //           fill="none"
    //           stroke="#bdc5d1"
    //           strokeWidth="5.4276"
    //           strokeMiterlimit="10"
    //           strokeDasharray="8.5629"
    //           d="M212.3,502.7c0.9-1.6,1.8-3.2,2.7-4.7"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#bdc5d1"
    //           strokeWidth="5.4276"
    //           strokeMiterlimit="10"
    //           strokeDasharray="8.5629"
    //           d="M220.8,488.8c1.9-2.8,3.8-5.5,5.7-8.3c13-18.3,27.7-35,43.4-49.8c22.5-21.3,47.4-38.9,73.8-52.2
    //           c33.5-16.8,69.3-26.4,105.4-29.2c46.6-3.6,93.4,4.1,138.3,19c44.5,14.8,84.6,43.6,128.8,59C767,445,821,448.1,872.8,434.9
    //           c6.4-1.6,12.8-3.5,19.1-5.6"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#bdc5d1"
    //           strokeWidth="5.4276"
    //           strokeMiterlimit="10"
    //           strokeDasharray="8.5629"
    //           d="M897.1,427.4c1.7-0.6,3.4-1.2,5.1-1.9"
    //         />
    //         <polyline
    //           fill="none"
    //           stroke="#bdc5d1"
    //           strokeWidth="4.5"
    //           strokeMiterlimit="10"
    //           strokeDasharray="7"
    //           points="885.9,410.4 918.5,419.1 896.8,440.8 "
    //         />
    //         <g>
    //           <path
    //             fill="#fff"
    //             d="M1916.1,696.8H992.9c-17.4,0-31.7-14.3-31.7-31.7V31.7c0-17.4,14.3-31.7,31.7-31.7h923.3
    //             c17.4,0,31.7,14.3,31.7,31.7v633.6C1947.8,682.6,1933.5,696.8,1916.1,696.8z"
    //           />
    //           <circle fill="#F7F7F7" cx="1452.8" cy="28.2" r="3.6" />
    //           <path
    //             fill="#fff"
    //             d="M2055.1,677.7H854.4c-1.8,0-3.4-1.6-3.4-3.4l0,0c0-1.8,1.6-3.4,3.4-3.4h1200.7c1.8,0,3.4,1.6,3.4,3.4l0,0
    //             C2058.5,676.2,2057.1,677.7,2055.1,677.7z"
    //           />
    //           <path
    //             fill="#EFEFEF"
    //             d="M1454.8,679.9l-603.9-2.2c0,0,29.1,13.7,142.4,19.1h459.5h3.7h459.6c113.3-5.4,142.4-19.1,142.4-19.1
    //             L1454.8,679.9z"
    //           />

    //           <linearGradient
    //             id="devices1ID_1"
    //             gradientUnits="userSpaceOnUse"
    //             x1="1339.1"
    //             y1="546.1826"
    //             x2="1570.1"
    //             y2="546.1826"
    //             gradientTransform="matrix(1 0 0 1 0 129.1174)"
    //           >
    //             <stop offset="5.908129e-07" style={{ stopColor: "#f0f1f2" }} />
    //             <stop offset="5.235744e-02" style={{ stopColor: "#f6f7f8" }} />
    //             <stop offset="0.1708" style={{ stopColor: "#fdfdfd" }} />
    //             <stop offset="0.5" style={{ stopColor: "#ffffff" }} />
    //             <stop offset="0.8292" style={{ stopColor: "#fdfdfd" }} />
    //             <stop offset="0.9476" style={{ stopColor: "#f6f7f8" }} />
    //             <stop offset="1" style={{ stopColor: "#f0f1f2" }} />
    //           </linearGradient>
    //           <path
    //             fill="url(#devices1ID_1)"
    //             d="M1565.7,679.5h-222.4c-2.3,0-4.2-1.9-4.2-4.2v-4.2h231v4.2C1570.1,677.6,1568.1,679.5,1565.7,679.5z"
    //           />
    //           <g>
    //             <defs>
    //               <rect
    //                 id="devices1ID_2"
    //                 x="998"
    //                 y="45.3"
    //                 width="909.6"
    //                 height="567.7"
    //               />
    //             </defs>
    //             <clipPath id="devices1ID_3">
    //               <use xlinkHref="#devices1ID_2" />
    //             </clipPath>
    //             <g clipPath="url(#devices1ID_3)">
    //               <image
    //                 id="SVGDevices1LaptopImg"
    //                 width="1618"
    //                 height="1010"
    //                 xlinkHref="/images/undraw_fill_forms_yltj.svg"
    //                 transform="matrix(0.5622 0 0 0.5622 998.0432 45.2877)"
    //               />
    //             </g>
    //             <g>
    //               <rect
    //                 id="laptopID2"
    //                 x="998"
    //                 y="45.3"
    //                 fill="none"
    //                 stroke="#e7eaf3"
    //                 strokeWidth="1.2"
    //                 strokeMiterlimit="10"
    //                 width="909.6"
    //                 height="567.7"
    //               />
    //             </g>
    //           </g>
    //         </g>
    //         <path
    //           fill="#e7eaf3"
    //           d="M303.1,849.1c-4,2.2-38.9,60.2-36.8,107.7c5.4-1.5,18.3-8.3,18.3-8.3l5.9-3.5l3.7-20.3l4.8-23l9-28.8l10.8-21
    //           l8.4-12l-7.8,2.4L303.1,849.1z"
    //         />
    //         <path
    //           fill="#e7eaf3"
    //           d="M402.5,938.6c0,0.3,0,0.7,0,1.3c0.4,13.4,4.4,92.4-50.4,124.7c24.6,27.6,64.8,3,64.8,3l5.4-6v-94.2l-1.2-2.4
    //           l-6.6-24l-8.4,0.6L402.5,938.6z"
    //         />
    //         <path
    //           fill="#ed1c24"
    //           d="M373.2,1150.2l-44.1-61c0,0-28.8-26.1-40.5-34.9c-0.1,9,0.5,73.5,3.2,95.9H373.2z"
    //         />
    //         <path
    //           fill="#ed1c24"
    //           d="M414.1,1140.4h8.2V1060c-20.7,6.6-120.8,7.2-133.6-5.8c0,1,19.2,53.2,53.8,93.5h71.6V1140.4z"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           opacity=".1"
    //           d="M414.1,1140.4h8.2V1060c-20.7,6.6-120.8,7.2-133.6-5.8c0,1,19.2,53.2,53.8,93.5h71.6V1140.4z"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="M266.1,898.1c-2.2,2.4-2.2,7-2.2,7c-2.7-8.1-61.6-154.6-61.6-154.6s-12.2,5.2,1.9,32.9
    //           c-4.5,2.7-17.2,12.8-12,29.1c3.9,12.3,12.6,16.5,18,16.5c-0.9,9.2,18.7,103,21.3,107.5c6,10.6,17.6,22.2,24.4,22.5
    //           c7.8,0.4,23.7-6.8,34.6-13.7"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M326.7,840c-29.6,5.5-67.2,40.4-66.3,47.9c0.9,7.1,19.4,27.6,33.4,37.3"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M345.3,823.5c-63.6,35.9-64.8,219.5-56.6,230.8c8,11,103.1,13.9,133.6,6.3"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M419.9,845.3c-8.7-12.7-20.2-21.9-35.1-25.8"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M414.7,940.7c1.6,6.9,4.9,19.8,8.2,32"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M395.6,925.2c3.1,8.9,6.5,15.1,8.9,15.9c3,1,9.8,0,17.8-2.1"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M422.3,846.9c-5.3-3.9-10.6-5.8-15.6-4.6"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M345.3,823.5v-10.3"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M384.8,794.3v42.8c0,3.5-9.3,5.6-18.9,5.9"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M384.7,794.3c3.6,2,9-0.1,12.5-5c3.7-5.1,3.7-11.3,0.2-13.9c-0.9-0.7-2-1-3.2-1.1"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M327.8,750.7c-0.6,1.3-1.2,2.6-1.7,3.9c-9.7,24.5-2.8,50.1,15.4,57.3c1.2,0.5,2.5,0.9,3.7,1.2"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M407.3,779.8c7.4-2.2,16.6-7.5,16.6-18c0-6.6-6.2-13.9-7.3-22.2c-0.6-4.2,0.7-21.7-4.2-27.6
    //           c-10.2-12.3-16.2-9.7-24-12.6c-13.6-5-18.8-13.2-30-13.2c-12.7,0-17.9,6.6-27,6.6c-10.4,0-19-4.8-33.6-4.8c-7.8,0-18,10.2-18,19.2
    //           c0,21.3,19.8,18.2,19.8,23.4c0,3.6-1.2,6.5-1.2,11.4c0,2.6,1.4,4.8,3.4,6.5"
    //         />
    //         <path
    //           fill="#e7eaf3"
    //           d="M187.1,682.6H217c8.9,0,16.1,7.2,16.1,16.1v29.9c0,8.9-7.2,16.1-16.1,16.1h-29.9c-8.9,0-16.1-7.2-16.1-16.1
    //           v-29.9C171.1,689.8,178.3,682.6,187.1,682.6z"
    //         />
    //         <circle fill="#ed1c24" cx="225.7" cy="687.6" r="12.7" />
    //         <path
    //           fill="#fff"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeMiterlimit="10"
    //           d="M389.4,544.2H187.9c-27.1,0-49.1,22-49.1,49.1v515.2c0,27.1,22,49.1,49.1,49.1l0,0h201.5
    //           c27.1,0,49.1-22,49.1-49.1V593.3C438.5,566.2,416.5,544.2,389.4,544.2z M422.3,848.9v256.5c0,18.7-15.2,33.9-33.9,33.9H188.9
    //           c-18.7,0-33.9-15.2-33.9-33.9l0,0v-509c0-18.7,15.2-33.9,33.9-33.9h33V573c0,5.2,4.2,9.4,9.4,9.4h114.4c5.2,0,9.4-4.2,9.4-9.4v-10.5
    //           h33c18.7,0,33.9,15.2,33.9,33.9l0,0L422.3,848.9z"
    //         />
    //         <path
    //           fill="#00c9a7"
    //           d="M493.4,620.4h-72.8c-13.1,0-23.8,10.7-23.8,23.8c0,6.9,2.9,13.1,7.7,17.5v15.9l10.3-10.3
    //           c1.9,0.5,3.8,0.7,5.8,0.7h72.8c13.1,0,23.8-10.7,23.8-23.8S506.5,620.4,493.4,620.4z"
    //         />
    //         <circle fill="#fff" cx="432.4" cy="645" r="6" />
    //         <circle fill="#fff" cx="457" cy="645" r="6" />
    //         <circle fill="#fff" cx="481.5" cy="645" r="6" />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M109.2,1090.2c1.2-3.4,1.9-7.7,1.9-13c0-80.1-94.8-58.5-94.8-125"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M33,951.7c5.1,6.7-12.1,14.4-14.5,11.1S27.5,944.6,33,951.7z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M116.9,834c6.3,8.1-12.2,15.6-15.2,11.7C98.7,841.8,110.2,825.3,116.9,834z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M111.9,867.7c5,9-19.2,16.2-21.6,11.9C87.9,875.3,106.6,858.1,111.9,867.7z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M113.4,893.3c6.5,7.9-15.9,19.4-19.1,15.6S106.4,884.8,113.4,893.3z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M121,922.1c6.5,7.9-15.9,19.4-19.1,15.6C98.8,934,114,913.6,121,922.1z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M127.7,948.9c5.9,7.2-13.7,17-16.5,13.6C108.3,959,121.4,941.2,127.7,948.9z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M136.7,978.2c5.9,7.2-13.7,17-16.5,13.6C117.3,988.3,130.4,970.5,136.7,978.2z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M0.3,946.4c2.1-8.2,18.8,0.7,17.7,4.7S-2,955.2,0.3,946.4z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M0,975.2c-1-8.4,17.7-6.3,18.2-2.3S1.2,984.2,0,975.2z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M16.6,1001.3c-5.5-6.4,11.3-15,14-11.9C33.2,992.4,22.4,1008.1,16.6,1001.3z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M37.4,1015.3c-3.3-7.8,15.3-10.9,16.9-7.2C55.8,1011.9,40.9,1023.6,37.4,1015.3z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M65.3,1030c-3.3-7.8,15.3-10.9,16.9-7.2S68.8,1038.3,65.3,1030z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M86.2,1051.2c-0.7-8.4,17.9-5.6,18.3-1.6S87,1060.2,86.2,1051.2z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M42,969.7c6.6,5.3-8.3,16.8-11.4,14.3C27.4,981.5,35,964.1,42,969.7z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M57,984.8c7.3,4.3-5.8,17.8-9.3,15.8S49.2,980.2,57,984.8z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M84.4,999.5c6.8,4.9-7.5,17.2-10.8,14.8S77.1,994.2,84.4,999.5z"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M107.4,1090c8.3-13.7,18.5-34.5,18.5-57.9c0-64.7-36.1-97.1-36.1-143.2c0-8.7,0.8-36.2,14.7-47.4"
    //         />
    //         <path
    //           fill="#fff"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M136.3,1181.5h-53c-2.5,0-4.7-1.6-5.4-3.9l-26.4-80c-1-3,0.7-6.3,3.7-7.2c0.6-0.2,1.2-0.3,1.8-0.3h106
    //           c3.2,0,5.7,2.6,5.7,5.7c0,0.6-0.1,1.2-0.3,1.8l-26.6,80C141,1179.9,138.8,1181.5,136.3,1181.5z"
    //         />
    //         <path
    //           fill="#e7eaf3"
    //           d="M132,1090.2c1.5,2.2,12.7,65.1-44.8,91.3c15.8-0.5,19.9,0.3,19.9,0.3h30l4.8-3l11.4-34.2l8.1-25.2l7.5-23.4
    //           l-1.8-4.3l-3.6-2.3L132,1090.2z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M145.3,1011.8c3.1,8.8-18.7,11.3-20.2,7.1C123.6,1014.7,141.9,1002.4,145.3,1011.8z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M109.6,1024.9c6.9-6.3,17.7,12.9,14.3,15.9S102.2,1031.6,109.6,1024.9z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M104,1001c4.6-8.1,20.8,6.6,18.6,10.5S99.1,1009.7,104,1001z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M98.8,972.6c4.6-8.1,20.8,6.6,18.6,10.5S93.9,981.3,98.8,972.6z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M89.5,950.1c3-8.8,21.7,2.6,20.3,6.8C108.4,961.2,86.3,959.6,89.5,950.1z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M76.3,919.1c4.4-8.3,21,6.1,18.9,10S71.7,927.9,76.3,919.1z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M70.1,884.5c5.1-7.8,20.4,8,17.9,11.7S64.7,892.9,70.1,884.5z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M73.2,854.8c5.1-7.8,20.4,8,17.9,11.7C88.7,870.3,67.7,863.2,73.2,854.8z"
    //         />
    //         <path
    //           fill="#1e2022"
    //           d="M145.3,1042.5c3.1,8.8-18.7,11.3-20.2,7.1C123.6,1045.4,141.9,1033.1,145.3,1042.5z"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M338.6,757.7c0,3-0.6,12.6-4.2,15"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M336.5,788.6c6,0,11.4-3.6,11.4-6"
    //         />
    //         <ellipse
    //           fill="none"
    //           stroke="#1e2022"
    //           cx="351.8"
    //           cy="759.2"
    //           rx="2.1"
    //           ry="3.6"
    //         />
    //         <path
    //           fill="none"
    //           stroke="#1e2022"
    //           strokeWidth="1.5"
    //           strokeLinecap="round"
    //           strokeMiterlimit="10"
    //           d="M136.3,1181.5h-53c-2.5,0-4.7-1.6-5.4-3.9l-26.4-80c-1-3,0.7-6.3,3.7-7.2c0.6-0.2,1.2-0.3,1.8-0.3h106
    //           c3.2,0,5.7,2.6,5.7,5.7c0,0.6-0.1,1.2-0.3,1.8l-26.6,80C141,1179.9,138.8,1181.5,136.3,1181.5z"
    //         />
    //       </svg>
    //     </figure>
    //   </div>

    //   <div className="row justify-content-lg-end">
    //     <div className="col-lg-7 mt-lg-n11">
    //       <h2 className="h1 mb-4">
    //         Use georgian cargo to simplify your oversees shopping needs
    //       </h2>
    //       <p>
    //         Georgian cargo is a collaboration hub for shopping, no matter where
    //         you shop. It's a place where shopping happen, savings are made, and
    //         information is always at your fingertips. With Georgian cargo, your
    //         parcel is in safe hands.
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
};
const Testimonials = () => {
  const sliderRef = React.useRef(null);

  const slickSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4500,
    speed: 550,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,          // we render our own arrows — no edge-clipping issues
    pauseOnHover: true,
    swipeToSlide: true,
    appendDots: dots => <ul className="gc-t-dots">{dots}</ul>,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="gc-testimonials" aria-labelledby="gc-testimonials-title">
      <div className="container">

        {/* Header + inline arrow controls */}
        <div className="gc-testimonials__head">
          <div className="gc-testimonials__head-text">
            <p className="gc-testimonials__eyebrow">Trusted Worldwide</p>
            <h2 id="gc-testimonials-title" className="gc-testimonials__title">
              Loved by customers worldwide
            </h2>
            <p className="gc-testimonials__subtitle">
              Real feedback from people who ship with us every day.
            </p>
          </div>
          <div className="gc-testimonials__controls" aria-label="Slider controls">
            <button
              className="gc-t-arrow"
              onClick={() => sliderRef.current && sliderRef.current.slickPrev()}
              aria-label="Previous"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="18" height="18">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="gc-t-arrow"
              onClick={() => sliderRef.current && sliderRef.current.slickNext()}
              aria-label="Next"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="18" height="18">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Slider — no overflow clipping, arrows never touch edges */}
        <div className="gc-testimonials__track">
          <SlickSlider ref={sliderRef} {...slickSettings}>
            {testimonials.map(({ content, name, src, srcFallback }, i) => (
              <div key={i} className="gc-tcard-wrap">
                <article className="gc-tcard">
                  <div className="gc-tcard__top">
                    <div className="gc-tcard__stars" aria-label="5 out of 5 stars">
                      {[0,1,2,3,4].map(n => (
                        <svg key={n} className="gc-tcard__star" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="gc-tcard__quote">{content}</p>
                  </div>
                  <footer className="gc-tcard__footer">
                    <picture>
                      <source srcSet={src} type="image/webp" />
                      <img className="gc-tcard__avatar" src={srcFallback || src} alt={name} loading="lazy" width="44" height="44" />
                    </picture>
                    <div>
                      <p className="gc-tcard__name">{name}</p>
                      <p className="gc-tcard__badge">
                        <i className="bi bi-patch-check-fill" aria-hidden="true"></i> Verified customer
                      </p>
                    </div>
                  </footer>
                </article>
              </div>
            ))}
          </SlickSlider>
        </div>

      </div>
    </section>
  );
};

const Stats = () => {
  const items = [
    {
      color: "#f59e0b",
      value: "5 / 5",
      label: "Rating",
      sub: "from 19 verified reviews",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/>
        </svg>
      ),
    },
    {
      color: "#1ca3dd",
      value: "10,000+",
      label: "Customers served",
      sub: "across Europe and beyond",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      color: "#10b981",
      value: "70,500+",
      label: "Parcels shipped",
      sub: "safely delivered worldwide",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="gc-stats">
      <div className="container">
        <div className="gc-stats__grid">
          {items.map(({ color, value, label, sub, icon }) => (
            <div key={label} className="gc-stats__item">
              <div className="gc-stats__icon-wrap" style={{ background: `${color}18`, color }}>
                {icon}
              </div>
              <div>
                <p className="gc-stats__value">{value}</p>
                <p className="gc-stats__label">{label}</p>
                <p className="gc-stats__sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Articles = () => {
  return (
    <></>
    // <div className="container">
    //   <div className="row">
    //     <div className="offset-lg-3 col-lg-6 mb-3 mb-lg-0">
    //       <article className="card h-100 space-1">
    //         <div className="w-sm-65 p-4">
    //           <h3>Blogs coming soon!</h3>
    //           <div className="mb-4">
    //             <p>Know how your parcels are processed soon!</p>
    //           </div>
    //           <button
    //             className="btn btn-sm btn-soft-success  transition-3d-hover"
    //             disabled="disabled"
    //           >
    //             Find out More
    //             <i className="fas fa-angle-right ms-1" />
    //           </button>
    //         </div>

    //         <div className="position-absolute bottom-0 right-0 w-sm-35 max-w-27rem">
    //           <img
    //             className="img-fluid"
    //             src="/theme/assets/svg/illustrations/support-man.svg"
    //             alt="Description"
    //           />
    //         </div>
    //       </article>
    //     </div>
    //   </div>
    // </div>
  );
};
const Subscribe = () => {
  return (""
    //<div className="position-relative text-center mt-6">
    //<div className="container">
    // <div className="w-md-60 mx-md-auto mb-5 mb-md-7">
    // <h2 className="h1">Stay in the know</h2>
    //<p />
    //<p>Get special offers right on your inbox</p>
    //</div>

    //<div className="w-md-75 w-lg-50 mx-md-auto">
    // <EmailSignupForm />
    // </div>
    //</div>
    //</div>
  );
};
export default HomePage;
