import React, { useState, useContext, useEffect } from 'react';

import { EmailSignupForm } from "components/EmailSignupForm";
import { ClientFooter } from "components/Footer";
import ItemsTable from "components/ItemsTable/ItemsTable";
import TransactionsTable from "components/TransactionsTable/TransactionsTable";
import { Slider, testimonials } from "utils";
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
import getRoutes from "requests/getRoutes";
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
  const [loyaltyModalShow, setLoyaltyModalSho] = useState(true);
  const openModal = () => setLoyaltyModalSho(true);
  const closeModal = () => setLoyaltyModalSho(false);

  return (
    <>
      <main id="content" role="main" className="bg-light mt-lg-0 mt-xl-8 mt-xxl-8" style={{ minWidth: "308px" }}>
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
        {console.log(window.location.pathname)}
        {(window.location.pathname !== '/home/register' && window.location.pathname !== '/home/login') && (
          <Modal show={loyaltyModalShow}
            centered
            backdrop={false}
            onHide={closeModal}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Refferal Program </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-5'>
                  <img className='d-inline-block w-100' src={"/images/undraw_gift_re_qr17.svg"} />

                </div>
                <div className='col-7'>
                  <h4>Woohoo, Very good news!</h4>
                  <p>You can now start collecting points in our Refferal Program , converting them into coupons and then applying it to your parcels to get DISCOUNTS! 🥳</p>
                  <small className='text-muted'>For more information please visit Loyalty page in your profile.</small>
                </div>
              </div>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => closeModal()}>Close</Button>
            </Modal.Footer>
          </Modal>
        )}

      </main>
      {/* <TransactionsTable /> */}
      <ClientFooter />
    </>
  );
};
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
  const [allRoutesData, setAllRoutesData] = useState('');
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
        if (r !== undefined) {
          setCookie('allRoutes', JSON.stringify(r.data.routes), { path: "/", expires: moment().add(1, "days").toDate() });
          setAllRoutesData(countryListAllIsoData.filter(obj => {
            return JSON.parse(JSON.stringify(r.data.routes)).map(a => a.code).includes(obj.value)
          }));
        }
      });
    }
    else {
      setAllRoutesData(countryListAllIsoData.filter(obj => {
        return JSON.parse(JSON.stringify(cookies.allRoutes)).map(a => a.code).includes(obj.value)
      }));
    }

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
    const locations = [
      [59.3293, 18.0686, 'https://flagsapi.com/SE/flat/48.png'], // sweden
      [53.3498, 10.2603, 'https://flagsapi.com/IE/flat/48.png'], // ireland
      [51.5072, -0.1276, 'https://flagsapi.com/GB/flat/48.png'], // uk
      [38.1872, 44.5152, 'https://flagsapi.com/AM/flat/48.png'], // armenia
      [41.6938, 44.8015, 'https://flagsapi.com/GE/flat/48.png'], // georgia
    ];
    const width = 500;
    const height = 500;
    const rotationSpeed = 0.02;
    const svg = d3
      .select("#earth")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var defs = svg.append('svg:defs');


    const projection = d3
      .geoOrthographic()
      .scale(250)
      .translate([width / 2, height / 2])
      .clipAngle(90); // Clip to a hemisphere
    const path = d3.geoPath().projection(projection);

    const markerProjection = d3.geoOrthographic()
      .scale(108)
      .translate(projection.translate());

    d3.json(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95802/world-110m.json"
    ).then((data) => {
      svg
        .append("path")
        .datum({ type: "Sphere" })
        .attr("d", path)
        .attr("fill", "#e5eef3")
        .attr("stroke", "#607D8B")
        .attr("stroke-width", 0.5);

      svg
        .selectAll(".country")
        .data(topojson.feature(data, data.objects.countries).features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", "#1CA3DD")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

      locations.forEach((itm, i) => {
        defs.append("svg:pattern")
          .attr("id", `grump_avatar${i}`)
          .attr("width", 48)
          .attr("height", 48)
          .attr("x", 0)
          .attr("y", 0)
          // .attr('patternUnits', 'userSpaceOnUse')
          .append("svg:image")
          .attr("xlink:href", itm[2])
          .attr("width", 32)
          .attr("height", 32);


        svg
          .selectAll(".location")
          .data(locations)
          .enter()
          .append("circle")
          .attr("class", "location")
          .attr("r", 15)
          .attr("fill", function (d, i) {
            return "url(#grump_avatar" + i + ")"
          })
          .attr("visibility", function (d) {
            // Hide the location if it's not in the visible hemisphere
            return d3.geoDistance(
              [itm[1], itm[0]],
              projection.invert([width / 2, height / 2])
            ) >
              Math.PI / 2
              ? "hidden"
              : "visible";
          });
      })
    });

    const rotate = () => {
      let dt = Date.now() - startTime;
      projection.rotate([rotationSpeed * dt - 120, -15]);
      markerProjection.rotate(projection.rotate());
      svg.selectAll("path").attr("d", path);
      svg
        .selectAll(".location")
        .attr("cx", function (d) {
          return projection([d[1], d[0]])[0];
        })
        .attr("cy", function (d) {
          return projection([d[1], d[0]])[1];
        })
        .attr("visibility", function (d) {
          return d3.geoDistance(
            [d[1], d[0]],
            projection.invert([width / 2, height / 2])
          ) >
            Math.PI / 2
            ? "hidden"
            : "visible";
        });
    };

    let startTime = Date.now();
    d3.timer(rotate);

    return () => {
      svg.selectAll("*").remove();
    };
  }, []);



  return (
    <div className="container">
      <style>{css}</style>

      <div className="border-bottom">
        <div className="w-lg-100 text-center mx-lg-auto">


          <div className='mt-xl-6 mt-xxl-6 mt-md-0 position-relative'>
            <h1 style={{ fontSize: "calc(100% + 2vw + 1vh)", color: "rgb(76, 78, 85)" }} className="text-start">Global shipments to
              <br />GEORGIA</h1>
            {/* <p className="lead">All your freight services in one place</p> */}
            {/* <div className="btn-group" role="group" aria-label="Basic example">
              <Button
                variant={active === 'tracking' ? "secondary" : 'outline-secondary'}
                className="rounded-0 border-bottom-0 rounded-top"
                onClick={() => setActive('tracking')}
                aria-controls="tracking-colapse"
                aria-expanded={active === 'tracking'}
              >
                Tracking
              </Button>
              <Button
                variant={active === 'booking' ? "secondary" : 'outline-secondary'}
                className="rounded-0 border-bottom-0 rounded-top"
                onClick={() => setActive('booking')}
                aria-controls="booking-colapse"
                aria-expanded={active === 'booking'}
              >
                Booking
              </Button>
            </div> */}

            <Collapse in={hash === '#tracking' || (match.params.tracking && !match.params.tracking.match(/^[a-z]+$/))}>
              <div id="tracking-colapse" className="pt-4 float-start">
                <PublicTrackingModal />
              </div>
            </Collapse>

            <Collapse in={hash === '#booking' || hash === ''} className="mb-4 pt-4 float-start">
              <div id="booking-colapse">
                {/* <Button className="btn btn-secondary me-2  btn-lg mb-4 mx-auto"
                  onClick={redirectToBooking}
                >
                  <i className="bi bi-file-earmark-plus"></i> Book now
                </Button> */}
                {auth?.isLoggedIn === true && (auth?.sourceCountry === '' || auth?.sourceCountry === 'null') && (
                  <small className='text-danger d-block w-100 text-start'>Please <Link to={"/dashboard/address"} className="text-danger"><span className='fw-bold'>enter</span></Link> your address in dasboard.</small>
                )}

                <div className="input-group mb-3" style={{ border: "4px solid #1CA3DD" }}>
                  <label className="input-group-text p-1 ps-2" for="">
                    <i className=" text-info bi bi-geo-alt-fill"></i>
                  </label>
                  <select disabled={auth.isLoggedIn === true && auth?.accountType === 'CLIENT'} value={sourceCountry}
                    onChange={(e) => setSourceCountry(e.target.value)}
                    className="form-select border-start-0" aria-label="Filter select">
                    {Object.getOwnPropertyNames(Steps).map((st, i) => (
                      <option value={st.toUpperCase()}
                      >{windowWidth < 400 ? countryListAllIsoData.find(x => x.value === st.toUpperCase()).value : countryListAllIsoData.find(x => x.value === st.toUpperCase()).label}</option>
                    ))}
                  </select>

                  <label className="input-group-text p-1 ps-2" for="">
                    <i className=" text-info bi bi-geo-alt-fill"></i>
                  </label>
                  <select disabled={allRoutesData === ''}
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="form-select border-start-0" aria-label="Filter select">
                    {allRoutesData === '' && (
                      <option>
                        Loading...
                      </option>
                    )}
                    {allRoutesData && allRoutesData.map((rt) => (
                      <option value={rt.value}
                      >{windowWidth < 400 ? rt.value : rt.label}</option>
                    ))}
                  </select>

                  <button className="form-control rounded-0 border-0 btn btn-secondary btn-lg" type="button" id="button-addon2"
                    onClick={redirectToBooking}
                  >Book Now</button>
                </div>
              </div>
            </Collapse>
            <div className="clearfix mb-xl-10 mb-xxl-10 mb-lg-10 mb-md-4"></div>
            <div className="row container d-flex text-start">
              <div className="template-demo ps-0 mt-0">
                <button className="btn btn-outline-dark border-0 btn-icon-text p-1 bg-white my-2"
                  style={{ color: "rgb(76, 78, 85)" }}>
                  <i className="bi bi-apple btn-icon-prepend"
                    style={{ fontSize: "23px", marginRight: "6px" }}></i>
                  <span className="text-start d-inline-block" style={{ lineHeight: "1" }}>
                    <small style={{ fontSize: "12px" }} className="font-weight-sm d-block text-muted">Get it on the</small>
                    <span className='fw-bold'>App Store</span>
                  </span>
                </button>
                &nbsp;
                <button className="btn btn-outline-dark border-0 btn-icon-text p-1 bg-white"
                  style={{ color: "rgb(76, 78, 85)" }}>
                  <i className="bi bi-google-play btn-icon-prepend"
                    style={{ fontSize: "23px", marginRight: "6px" }}></i>
                  <span className="text-start d-inline-block" style={{ lineHeight: "1" }}>
                    <small style={{ fontSize: "12px" }} className="font-weight-light d-block text-muted">Get it on the</small>

                    <span className='fw-bold'>Google Play</span>
                  </span>
                </button>
              </div>

            </div>

            <div className="d-block float-start mt-4">
              {/* <h3 className="float-start" style={{ lineHeight: "1.9", color: "rgb(76, 78, 85)" }} >Get in on</h3>
              &nbsp;
              <button style={{ color: "rgb(76, 78, 85)" }} className="btn btn-white app-button">
                <i className="bi bi-apple"></i>&nbsp; <span className="ml-2">Apple store</span>
              </button>

              <button style={{ color: "rgb(76, 78, 85)" }} className="btn btn-white app-button ms-lg-2 ms-md-2">
                <i className="bi bi-google-play"></i>&nbsp;<span className="ml-2">Google store</span>
              </button> */}
              <div className='float-start'>
                {/*<a href="https://www.facebook.com/georgiancargoworld/" title="Georgian Cargo facebook" target="_blank" style={{ fontSize: "20px", color: "rgb(76, 78, 85)" }}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="" target="_blank" title="Georgian Cargo twitter" style={{ fontSize: "20px", color: "rgb(76, 78, 85)" }}>
                  <i className="fab fa-twitter ms-2"></i>
                </a>
                <a href="" target="_blank" title="Georgian Cargo instagram" style={{ fontSize: "20px", color: "rgb(76, 78, 85)" }}>
                  <i className="fab fa-instagram ms-2"></i>
                </a>
                <a href="" target="_blank" title="Georgian Cargo linkedin" style={{ fontSize: "20px", color: "rgb(76, 78, 85)" }}>
                  <i className="bi bi-linkedin ms-2"></i>
                </a>
                <a href="" target="_blank" title="Georgian Cargo youtube" style={{ fontSize: "20px", color: "rgb(76, 78, 85)" }}>
                  <i className="fab fa-youtube ms-2"></i>
                </a>*/}
              </div>

            </div>
            <div className="d-none d-lg-block d-md-block" id="earth" style={{ height: "300px", position: "absolute", right: "calc(10% - 10vw)", top: "-20px", zIndex: "-1" }}></div>

          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <figure className="figure w-85">
            <figcaption className="figure-caption row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xxl-5 col-xl-5 text-start">
                <h2 className="card-title text-md-center text-center text-lg-start text-xl-start text-xxl-start">Personal Dashboard</h2>
                <p className="card-text h4 text-md-center text-center text-lg-start text-xl-start text-xxl-start" style={{ lineHeight: "1.6" }}>See and manage all your shipments in one place on desktop  and mobile</p>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xxl-7 col-xl-7">
                <img src="/responsive-example.png" className='img-fluid' />
              </div>
            </figcaption>

          </figure>


          <hr />

          <figure className="figure">
            <figcaption className="figure-caption">
              <h2 className="card-title">Discount Parcel Delivery</h2>
              <p className="card-text h5" style={{ lineHeight: "1.6" }}>Sending parcels and pallets online should be easy.<br />So we've made our booking process fast and simple to use</p>
            </figcaption>
            <div className="container mt-6">
              <div className="row">
                <div className="col-12 col-md-4 col-sm-12">
                  <figure className="figure">
                    <img src="/delivery-courier-truck.png" className='img-fluid w-50' />

                    <figcaption className="figure-caption">
                      <h4 className="card-title">Enter Destination</h4>
                      <p className="card-text h6" style={{ lineHeight: "1.6" }}>We deliver parcels to your destination
                        to Georgia or elsewhere
                        guiding you all the way</p>
                    </figcaption>
                  </figure>
                </div>
                <div className="col-12 col-md-4 col-sm-12">
                  <figure className="figure">
                    <img width="93%" src="/pile-packing-boxes.png" className='img-fluid w-50' />

                    <figcaption className="figure-caption">
                      <h4 className="card-title">Great Service</h4>
                      <p className="card-text h6" style={{ lineHeight: "1.6" }}>
                        Services. Make your choise based on price, service or speed of delivery.
                      </p>
                    </figcaption>
                  </figure>
                </div>
                <div className="col-12 col-md-4 col-sm-12">
                  <figure className="figure">
                    <img src="/man-working-laptop.png" className='img-fluid w-50' />

                    <figcaption className="figure-caption">
                      <h4 className="card-title">Book Online</h4>
                      <p className="card-text h6" style={{ lineHeight: "1.6" }}>
                        Book your delivery with us and we'll do the rest. you can pay by any credit card with Stripe.
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </figure>

          <hr className='mt-8 mb-8' />

          <figure className="figure">
            <figcaption className="figure-caption">
              <h2 className="card-title mb-4">We Make Difference</h2>
              <p className="card-text h5 w-75 mx-auto" style={{ lineHeight: "1.6" }}>We observe about customer service, so give us a call if you need any help. all our staff are trained and knowledgeable about all the services we sell.</p>
            </figcaption>
            <div className='container w-75 mb-2'>
              <div className='row'>
                <div className="col-12 col-sm-12 col-md-6">
                  <ul className='text-start'>
                    <li className='mt-8'><i style={{ fontSize: "25px" }} className="text-success bi bi-check-lg"></i> &nbsp;&nbsp; Great Prices</li>
                    <li className='mt-2'><i style={{ fontSize: "25px" }} className="text-success bi bi-check-lg"></i>&nbsp;&nbsp;Excellent Customer Service</li>
                    <li className='mt-2'><i style={{ fontSize: "25px" }} className="text-success bi bi-check-lg"></i>&nbsp;&nbsp;Large Range Of Courier Services</li>
                    <li className='mt-2'><i style={{ fontSize: "25px" }} className="text-success bi bi-check-lg"></i>&nbsp;&nbsp;Proactive Tracking Notifications</li>
                    <li className='mt-2'><i style={{ fontSize: "25px" }} className="text-success bi bi-check-lg"></i>&nbsp;&nbsp;Telephone, Email & Live Chat Support</li>
                  </ul>
                </div>
                <div className="col-12 col-sm-12 col-md-6">
                  <img src="/man-working-laptop.png" className='img-fluid w-75' />
                </div>
              </div>
            </div>
          </figure>

          <hr className='mt-8 mb-8' />

          <figure className="figure w-100">
            <figcaption className="figure-caption mb-4">
              <h2 className="card-title mb-4 h4 text-primary" style={{ letterSpacing: ".3rem", textTransform: "uppercase" }}>Popular Shipments</h2>
              <p className="card-text h1 w-100 mx-auto" style={{ lineHeight: ".2" }}>What others have sent</p>
            </figcaption>
            <div className='container w-100 mb-6'>
              <div className='row'>
                <div className="col-12 col-sm-12 col-md-12">

                  <ul className="nav nav-tabs nav-fill mb-3" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active fw-bold" id="hoit-tab" data-bs-toggle="tab" data-bs-target="#hoit" type="button" role="tab" aria-controls="hoit" aria-selected="true">Household Items</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link fw-bold" id="spoequ-tab" data-bs-toggle="tab" data-bs-target="#spoequ" type="button" role="tab" aria-controls="spoequ" aria-selected="false">Sports Equipments</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link fw-bold" id="furni-tab" data-bs-toggle="tab" data-bs-target="#furni" type="button" role="tab" aria-controls="furni" aria-selected="false">Furniture</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link fw-bold" id="elect-tab" data-bs-toggle="tab" data-bs-target="#elect" type="button" role="tab" aria-controls="elect" aria-selected="false">Electronics</button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="hoit" role="tabpanel" aria-labelledby="hoit-tab">
                      <div className="container">
                        <div className='row g-2'>
                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-tv text-primary"></i>

                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Television</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£40.16</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-door-closed text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Smeg Fridge</p>
                                      <span className="fw-bold text-muted">Ireland</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£187.22</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-guitar text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Guitar</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£55.55</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="spoequ" role="tabpanel" aria-labelledby="spoequ-tab">
                      <div className="container">
                        <div className='row g-2'>
                          <div className="col-12 col-lg-6 col-md-12 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">

                                      <svg style={{ fontSize: "35px" }} xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-scooter text-primary" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M9 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-.39l1.4 7a2.5 2.5 0 1 1-.98.195l-.189-.938-2.43 3.527A.5.5 0 0 1 9.5 13H4.95a2.5 2.5 0 1 1 0-1h4.287l2.831-4.11L11.09 3H9.5a.5.5 0 0 1-.5-.5ZM3.915 12a1.5 1.5 0 1 0 0 1H2.5a.5.5 0 0 1 0-1h1.415Zm8.817-.789A1.499 1.499 0 0 0 13.5 14a1.5 1.5 0 0 0 .213-2.985l.277 1.387a.5.5 0 0 1-.98.196l-.278-1.387Z" />
                                      </svg>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Electric Scooter</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£52.98</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-bicycle text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Bike</p>
                                      <span className="fw-bold text-muted">Ireland</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£143.96</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-running text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Treadmill</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£55.55</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="furni" role="tabpanel" aria-labelledby="furni-tab">
                      <div className="container">
                        <div className='row g-2'>
                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-chair text-primary"></i>

                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Small Furniture</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£31.62</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-record-vinyl text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Table</p>
                                      <span className="fw-bold text-muted">Ireland</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£399.14</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-desktop text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Desktop Monitor</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£5.85</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="elect" role="tabpanel" aria-labelledby="elect-tab">
                      <div className="container">
                        <div className='row g-2'>
                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="text-primary bi bi-projector" viewBox="0 0 16 16">
                                        <path d="M14 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM2.5 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4Zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4Z" />
                                        <path d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1H5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1 2 2 0 0 1-2-2V6Zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H2Z" />
                                      </svg>

                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Projector</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£46.15</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-laptop text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Laptop</p>
                                      <span className="fw-bold text-muted">Ireland</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£35.89</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
                            <div className="card">
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="row">
                                    <div className="col-3 pt-2">
                                      <i style={{ fontSize: "35px" }} className="fas fa-mobile-alt text-primary"></i>
                                    </div>
                                    <div className="col-9 text-start">
                                      <p className='h3'>Mobile Phone</p>
                                      <span className="fw-bold text-muted">United Kingdom</span> to <span className="fw-bold text-muted">Georgia</span>
                                      <br />
                                      <span className="mt-1 h3 fw-bold text-primary">£23.92</span><small className='text-muted'> + VAT</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </figure>
          <hr className='mt-8 mb-8' />
          {allRoutesData && (
            <>
              <PublicPriceCalculator allRoutesData={allRoutesData} redirectToBooking={redirectToBooking} />
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
  const style = {
    height: "200px",
    maxHeight: "200px",
    overflowY: "scroll",
  };
  const Testimonial = ({ content, name, src }) => (
    <div className="p-3">
      <div className="card h-100">
        <div className="card-body">
          <ul className="list-inline text-warning">
            <li className="list-inline-item mx-0">
              <i className="fas fa-star" />
            </li>
            <li className="list-inline-item mx-0">
              <i className="fas fa-star" />
            </li>
            <li className="list-inline-item mx-0">
              <i className="fas fa-star" />
            </li>
            <li className="list-inline-item mx-0">
              <i className="fas fa-star" />
            </li>
            <li className="list-inline-item mx-0">
              <i className="fas fa-star" />
            </li>
          </ul>
          <div className="mb-auto" style={style}>
            <p className="text-dark mb-0">{content}</p>
          </div>
        </div>

        <div className="card-footer border-0 bg-transparent pt-0 px-5 pb-5">
          <div className="media align-items-center">
            <div className="avatar avatar-circle me-3">
              <img className="avatar-img" src={src} alt="Description" />
            </div>
            <div className="media-body">
              <h4 className="mb-0">{name}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-8">
      <div className="w-md-100 w-lg-100 mb-3 mb-md-5 text-center">
        <h2 className="h1">Georgian cargo is loved by users worldwide</h2>
      </div>
      <div className="card-gutters-2">
        <Slider xl={3}>
          {testimonials.map((testimonial, i) => (
            <Testimonial {...testimonial} key={i} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="container mt-6">
      <div className="row justify-content-lg-center">
        <div className="col-md-4 mb-7 mb-lg-0">
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="text-center px-md-3 px-lg-7">
              <figure className="mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 71.7 64"
                  width="71"
                  height="64"
                >
                  <path
                    fill="#FFC107"
                    d="M36.8,14.6L42,25.3c0,0.2,0.2,0.2,0.3,0.3L54,27.2c0.3,0,0.5,0.5,0.3,0.8l-8.5,8.2c-0.2,0.2-0.2,0.3-0.2,0.5
                    l2,11.7c0,0.3-0.3,0.7-0.7,0.5l-10.5-5.6c-0.2,0-0.3,0-0.5,0l-10.5,5.6c-0.3,0.2-0.8-0.2-0.7-0.5l2-11.7c0-0.2,0-0.3-0.2-0.5
                    L18,28.1c-0.3-0.3-0.2-0.8,0.3-0.8L30,25.6c0.2,0,0.3-0.2,0.3-0.3l5.3-10.7C36.1,14.2,36.6,14.2,36.8,14.6z"
                  />
                  <path
                    opacity=".25"
                    fill="#FFC107"
                    d="M56,5.9l1.5,2.8c0,0,0,0,0.2,0l3.1,0.5c0.2,0,0.2,0.2,0,0.2l-2.3,2.3c0,0,0,0,0,0.2l0.5,3.1
                    c0,0.2-0.2,0.2-0.2,0.2L56,13.6h-0.2L53,15.1c-0.2,0-0.2,0-0.2-0.2l0.5-3.1v-0.2l-2.3-2.3V9.2l3.1-0.5c0,0,0,0,0.2,0l1.5-2.8
                    C55.8,5.7,55.8,5.7,56,5.9z"
                  />
                  <path
                    opacity=".25"
                    fill="#FFC107"
                    d="M12.3,0.3l1.3,2.8c0,0,0,0,0.2,0l3,0.5c0.2,0,0.2,0.2,0,0.2l-2.1,2.1c0,0,0,0,0,0.2l0.5,3
                    c0,0.2-0.2,0.2-0.2,0.2l-2.6-1.5c0,0,0,0-0.2,0L9.5,9.2c-0.2,0-0.2,0-0.2-0.2l0.5-3c0,0,0,0,0-0.2L7.5,3.7V3.6l3-0.5c0,0,0,0,0.2,0
                    l1.3-2.8C12.1,0.3,12.3,0.3,12.3,0.3z"
                  />
                  <path
                    opacity=".25"
                    fill="#FFC107"
                    d="M13.9,49.9l1.5,2.8c0,0,0,0,0.2,0l3.1,0.5c0.2,0,0.2,0.2,0,0.2l-2.3,2.3c0,0,0,0,0,0.2l0.5,3.1
                    c0,0.2-0.2,0.2-0.2,0.2l-2.8-1.5h-0.2L11,59.1c-0.2,0-0.2,0-0.2-0.2l0.5-3.1v-0.2L9,53.4v-0.2l3.1-0.5c0,0,0,0,0.2,0l1.3-2.8
                    C13.8,49.8,13.9,49.8,13.9,49.9z"
                  />
                  <path
                    opacity=".25"
                    fill="#FFC107"
                    d="M60.8,53.5l1.6,3.1c0,0,0,0,0.2,0l3.5,0.5c0.2,0,0.2,0.2,0,0.3l-2.5,2.5c0,0,0,0,0,0.2l0.7,3.5
                    c0,0.2-0.2,0.2-0.2,0.2l-3.1-1.6h-0.2l-3.1,1.6c-0.2,0-0.2,0-0.2-0.2l0.7-3.5v-0.2l-2.5-2.5c-0.2-0.2,0-0.2,0-0.3l3.5-0.5h0.2
                    l1.6-3.1C60.4,53.4,60.6,53.4,60.8,53.5z"
                  />
                </svg>
              </figure>
              <p className="mb-0">
                <span className="text-dark fw-bold">
                  5 out of 5 starts
                </span>
                from 19 reviews
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-7 mb-lg-0">
          <div data-aos="fade-up">
            <div className="text-center column-divider-md column-divider-20deg px-md-3 px-lg-7">
              <figure className="mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 71.7 64"
                  width="71"
                  height="64"
                >
                  <defs>
                    <circle id="SVGID_1_" cx="50.9" cy="43.1" r="18.9" />
                  </defs>
                  <clipPath id="SVGID_2_">
                    <use xlinkHref="#SVGID_1_" />
                  </clipPath>
                  <g
                    transform="matrix(1 0 0 1 0 1.907349e-06)"
                    style={{ clipPath: "url(#SVGID_2_)" }}
                  >
                    <image
                      width="100"
                      height="100"
                      xlinkHref="/images/client_2.jpg"
                      transform="matrix(0.36 0 0 0.36 32.8571 25.1429)"
                    />
                  </g>
                  <use
                    xlinkHref="#SVGID_1_"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                  />
                  <defs>
                    <circle id="SVGID_3_" cx="34.6" cy="20.9" r="18.9" />
                  </defs>
                  <clipPath id="SVGID_4_">
                    <use xlinkHref="#SVGID_3_" />
                  </clipPath>
                  <g style={{ clipPath: "url(#SVGID_4_)" }}>
                    <image
                      width="100"
                      height="100"
                      xlinkHref="/images/client_3.jpg"
                      transform="matrix(0.36 0 0 0.36 16.5714 2.8571)"
                    />
                  </g>
                  <use
                    xlinkHref="#SVGID_3_"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                  />
                  <defs>
                    <circle id="SVGID_5_" cx="20.9" cy="43.1" r="18.9" />
                  </defs>
                  <clipPath id="SVGID_6_">
                    <use xlinkHref="#SVGID_5_" />
                  </clipPath>
                  <g style={{ clipPath: "url(#SVGID_6_)" }}>
                    <image
                      width="100"
                      height="100"
                      xlinkHref="/images/client_4.jpg"
                      transform="matrix(0.3771 0 0 0.3771 2 24.2857)"
                    />
                  </g>
                  <use
                    xlinkHref="#SVGID_5_"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                  />
                </svg>
              </figure>
              <p className=" mb-0">
                Over
                <span className="text-dark fw-bold"> 10,000 </span>
                Customers served
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="text-center column-divider-md column-divider-20deg px-md-3 px-lg-7">
              <figure className="max-w-8rem mx-auto mb-3">
                <img
                  className="img-fluid w-25"
                  src="/theme/assets/svg/icons/icon-64.svg"
                  alt="SVG"
                />
              </figure>
              <p className="mb-0">
                <span className="text-dark fw-bold">70,500 </span>
                Parcels shipped
              </p>
            </div>
          </div>
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
