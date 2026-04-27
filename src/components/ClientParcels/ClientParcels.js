import React, { useState, useEffect, useContext } from "react";
import cargosRequest from "requests/cargos";
import Spinner from "react-bootstrap/Spinner";
import { useRequest } from "hooks";
import { currency_symbols } from "../../utils/Currency";
import { flagEmoji } from "../../utils/FlagEmoji";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button';
import moment from "moment";
import { useAxios } from "../../hooks";
import { getPublicParcelByTrackingNumber } from "requests";
import $ from "jquery";
import { Modal } from "react-bootstrap";
import { Modal as Modal2, SpinnerButton, ValidatedInput } from "utils";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { AuthContext } from "context";
import axios from "axios";
import BookNotesModalClient from "components/BookNotesModalClient";
import clientCoupons from "requests/clientCoupons";
import clientApplyCouponOnParcel from "requests/clientApplyCouponOnParcel";


const initFilter = { start: 0, payment_status: "PENDING", query: "", limit: 6 };

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const steps = [
  {
    label: "Picked up",
    value: "PICKUP",
  },
  {
    label: "Processing",
    value: "PROCESS",
  },
  {
    label: "In transit",
    value: "TRANSIT",
  },
  {
    label: "Arrived",
    value: "ARRIVE",
  },
  {
    label: "Received",
    value: "RECEIVE",
  },
];

const ClientParcels = () => {
  const [filter, setFilter] = useState();
  const [getTrackingHistory] = useRequest(getPublicParcelByTrackingNumber);
  const [getClientCouponsReq] = useRequest(clientCoupons);
  const [clientApplyCouponOnParcelReq] = useRequest(clientApplyCouponOnParcel);
  const [itemHistory, setItemHistory] = useState({});
  const [lastEvent, setLastEvent] = useState(null);
  const [isDelayed, setIsDelayed] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getCargos] = useRequest(cargosRequest);
  const [cookies, setCookie, removeCookie] = useCookies(['parcelsCart']);
  const [showUploadInvoice, setShowUploadInvoice] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedCargoInvoice, setSelectedCargoInvoice] = useState(null);
  const { auth } = useContext(AuthContext);
  const { accessToken } = { ...auth };
  const [activeNotes, setActiveNotes] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [handlingApplyingCoupon, setHandlingApplyingCoupon] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [applyCouponData, setApplyCouponData] = useState({
    tracking: "",
    coupon: ""
  });

  useEffect(() => {
    setFilter(initFilter);
    getClientCouponsReq({ start: 0, limit: 20 })
      .then((response) => {
        setCoupons(response.data.coupons);
      });
  }, []);

  const closeApplyCouponsModal = () => {
    setApplyingCoupon(false);
    setApplyCouponData({
      tracking: "",
      coupon: ""
    });
  };

  const handleApplyCoupon = () => {
    setHandlingApplyingCoupon(true);
    clientApplyCouponOnParcelReq(applyCouponData)
      .then((response) => {
        let cpns = [...coupons];
        setCoupons(cpns.filter(x => x.code !== applyCouponData.coupon));
        let prcls = [...parcels];
        toast.success("Coupon Applied!", toastOptions);
        setTimeout(() => window.location.reload(), 2000)
      });
    setHandlingApplyingCoupon(false);
  };

  const openApplyCouponsModal = () => {
    setApplyingCoupon(true);
  };

  useEffect(() => {
    getCargosHandler();
  }, [filter]);

  useEffect(() => {
  }, [parcels]);

  const closeNotesModalModal = () => {
    setShowNotesModal(false);
  };

  const openNotesModalModal = (book) => {
    setActiveNotes(book);
    setShowNotesModal(true);
  };


  const handleNext = () => {
    setFilter({ ...filter, start: (parseInt(filter.start) + filter.limit) });
  };

  const handlePrev = () => {
    let start = parseInt(filter.start) < filter.limit ? 0 : parseInt(filter.start) - filter.limit;
    setFilter({ ...filter, start: start.toString() });
  };

  const handlePending = () => {
    setFilter({ ...filter, payment_status: "PENDING" });
  };

  const handlePaid = () => {
    setFilter({ ...filter, payment_status: "PAID" });
  };

  const handlePaymentAll = () => {
    setFilter({ ...filter, payment_status: "" });
  };

  const handleSearch = (val) => {
    setFilter({ ...filter, query: val });
  };

  const isCargoOnCart = (cargo) => {
    return cookies.parcelsCart !== undefined && Array.isArray(cookies.parcelsCart) && (-1 !== cookies.parcelsCart.findIndex(x => x.trackingNumber == cargo.tracking_number && x.total == cargo.invoice.total_amount))
  };

  const handleRemoveCart = (cargo) => {
    let arr = cookies.parcelsCart;
    let index = arr.findIndex(x => x.trackingNumber == cargo.tracking_number && x.total == cargo.invoice.total_amount);
    if (index > -1) {
      removeCookie('parcelsCart', { path: '/' });
      arr.splice(index, 1);
      setCookie('parcelsCart', JSON.stringify(arr), { path: '/' });
      toast.success("Removed from cart!", toastOptions);
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }


  const handleAddCart = (cargo) => {
    let arr = Array.isArray(cookies.parcelsCart) ? cookies.parcelsCart : [];
    // console.log(arr);
    if (cargo.invoice.payment_status == "PAID") {
      toast.error("Cargo is already paid!", toastOptions);
      return;
    }
    let objToPush = { trackingNumber: cargo.tracking_number, invoiceId: cargo.invoice.invoice_id, total: cargo.invoice.total_amount, currency: cargo.invoice.currency_code };
    if (cookies.parcelsCart === undefined || !Array.isArray(cookies.parcelsCart)) {
      setCookie('parcelsCart', JSON.stringify([objToPush]), { path: '/' });
      toast.success("Added to cart!", toastOptions);
    }
    else {
      let index = cookies.parcelsCart.findIndex(x => x.trackingNumber == cargo.tracking_number && x.total == cargo.invoice.total_amount);
      if (index === -1) {
        arr.push(objToPush);
        setCookie('parcelsCart', JSON.stringify(arr), { path: '/' });
        toast.success("Added to cart!", toastOptions);
      }
      else {
        toast.error("Cargo is already on cart!", toastOptions);
        return;
      }
    }
  };

  const uploadInvoice = (cargo) => {
    // console.log(cargo.customer_invoices.length);
    setSelectedCargoInvoice(cargo);
    setShowUploadInvoice(true);
  };

  const CloseUploadInvoice = () => {
    setShowUploadInvoice(false);
  };

  const handleInvoiceChange = (e) => {

    // console.log(selectedCargoTrackingNumber);
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (null !== file) {
      let url = process.env.REACT_APP_API + '/customer/invoice';
      const formData = new FormData();
      formData.append('invoice', file);
      formData.append('tracking_number', selectedCargoInvoice.tracking_number);
      formData.append('fileName', file.name);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      };
      axios.post(url, formData, config).then((response) => {

        setSelectedCargoInvoice({ ...selectedCargoInvoice, customer_invoices: [...selectedCargoInvoice.customer_invoices, response.data.invoice_name] });
        getCargosHandler();
        toast.success("File was uploaded", toastOptions);
      }).catch((error) => {
        toast.error(error.response.data.message, toastOptions);
      });
      setFile(null);
    }

  }, [file, selectedCargoInvoice]);

  useEffect(() => {
    // getCargosHandler();
    // setSelectedCargoInvoice
  }, [file]);

  const trackCargo = (trackingNumber) => {
    setItemHistory({});
    setLastEvent(null);
    setIsDelayed(false);
    getTrackingHistory(trackingNumber)
      .then((r) => {
        let next = {};
        r.data.history.forEach((event, i) => {
          next[event.type] = {
            at: event.time,
          };
          if (event.type === "DELAY") {
            setIsDelayed(true);
          } else {
            setLastEvent(event.type);
          }
        });
        setItemHistory(next);
        $("#public_tracking").modal("show");

      })
  };

  const getCargosHandler = () => {
    getCargos({ ...filter })
      .then((data) => {
        setParcels(data.data.cargos);
        setLoading(false);
      })
      .catch((e) => console.error(e, 999));
  };

  return (
    // <div className="container content-space-1 content-space-t-lg-0 content-space-b-lg-2 mt-lg-n10">
    <>
      {filter && (
        <div className="card">
          <div className="card-header border-bottom">
            <form className="input-group input-group-merge">
              <div className="input-group-prepend input-group-text">
                <i className="bi-search"></i>
              </div>
              <input onChange={(e) => handleSearch(e.target.value)} type="search" className="form-control" placeholder="Search parcels" aria-label="Search parcels" />
            </form>
          </div>

          <div className="card-body p-2" style={{ backgroundColor: "#f8fafd" }}>
            <div className="js-nav-scroller hs-nav-scroller-horizontal text-center">
              <span className="hs-nav-scroller-arrow-prev" style={{ display: 'none' }}>
                <a className="hs-nav-scroller-arrow-link" href="#">
                  <i className="bi-chevron-left"></i>
                </a>
              </span>

              <span className="hs-nav-scroller-arrow-next" style={{ display: 'none' }}>
                <a className="hs-nav-scroller-arrow-link" href="#">
                  <i className="bi-chevron-right"></i>
                </a>
              </span>

              <ul className="nav nav-segment nav-fill mb-7" id="featuresTab" role="tablist">
                <li role="button" className="nav-item" >
                  <a onClick={handlePaymentAll} className={"nav-link" + (filter.payment_status == '' ? ' active' : '')} id="accountOrdersOne-tab" data-bs-toggle="tab" data-bs-target="#accountOrdersOne" role="tab" aria-controls="accountOrdersOne" aria-selected="false">All</a>
                </li>

                <li role="button" className="nav-item" >
                  <a onClick={handlePending} className={"nav-link" + (filter.payment_status == 'PENDING' ? ' active' : '')} id="accountOrdersOne-tab" data-bs-toggle="tab" data-bs-target="#accountOrdersOne" role="tab" aria-controls="accountOrdersOne" aria-selected="true">Not paid</a>
                </li>

                <li role="button" className="nav-item" >
                  <a onClick={handlePaid} className={"nav-link" + (filter.payment_status == 'PAID' ? ' active' : '')} id="accountOrdersOne-tab" data-bs-toggle="tab" data-bs-target="#accountOrdersOne" role="tab" aria-controls="accountOrdersOne" aria-selected="false">Paid</a>
                </li>

                {/* <li className="nav-item" role="presentation">
                  <a className="nav-link" href="#accountOrdersThree" id="accountOrdersThree-tab" data-bs-toggle="tab" data-bs-target="#accountOrdersThree" role="tab" aria-controls="accountOrdersThree" aria-selected="false">Canceled Orders</a>
                </li> */}
              </ul>
              <nav aria-label="Page navigation" className="pb-4 d-inline-block">
                <ul className="pagination justify-content-center">
                  <li className={"page-item" + (filter.start == "0" ? " disabled" : "")}>
                    <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                  </li>
                  <li className={"page-item" + (parcels == null || parcels.length == 0 ? " disabled" : "")}>
                    <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="tab-content" id="accountOrdersTabContent">
              <div className="tab-pane fade show active" id="accountOrdersOne" role="tabpanel" aria-labelledby="accountOrdersOne-tab">
                {/* <div className="d-sm-flex align-items-sm-center mb-5">
                  <div className="mb-2 mb-sm-0 me-3">
                    <span><strong className="text-dark">3 orders</strong> placed in</span>
                  </div>

                  <div className="tom-select-custom">
                    <select className="js-select form-select form-select-sm">
                      <option value="last 30 days">last 30 days</option>
                      <option value="past 6 months" selected>past 6 months</option>
                      <option value="2019">2019</option>
                    </select>
                  </div>
                </div> */}

                <ul className="list-unstyled mb-5">

                  {loading && (
                    <div className="d-flex justify-content-center align-items-center m-10">
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}

                  {!loading && parcels && parcels.map((cargo, i) => (

                    <li className="card card-bordered shadow-sm mb-3" key={i}>
                      {/* {console.log(cargo)} */}
                      <div className="card-body p-2 pt-3">
                        <div className="row">
                          <div className="col-6 col-md-3">
                            <small className="card-subtitle mb-0">Tracking n.</small>
                            {/* <small role="button" onClick={() => trackCargo(cargo.tracking_number)} className="bt btn-link fw-semibold">{cargo.tracking_number}</small> */}
                            <a type="button" style={{ fontSize: "0.68rem", padding: "6px" }} className="mb-2 btn btn-sm  btn-outline-info" onClick={() => trackCargo(cargo.tracking_number)}><i className="bi-truck small me-2"></i> Track: {cargo.tracking_number}</a>
                          </div>


                          <div className="col-6 col-md-2 mb-3 mb-md-0">
                            <small className="card-subtitle mb-0">Total</small>
                            {/* <small className="text-dark fw-semibold"></small> */}
                            {cargo.invoice.payment_status == 'PAID' ? (
                              <>

                                <span class="badge badge-pill badge bg-success">Paid {currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.total_amount.toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                              </>

                            ) : (
                              <>
                                <span class="badge badge-pill badge bg-danger">Unpaid {currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.total_amount.toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                              </>

                            )}
                            <br />
                            <br />
                            <small className="card-subtitle mb-0">Extra total</small>
                            {cargo.extra_extra_charges.length !== 0 && (

                              <small className="text-dark fw-semibold">{currency_symbols(cargo.invoice.currency_code)}{cargo.extra_extra_charges.map(item => item.total).reduce((prev, next) => prev + next).toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</small>
                            )}
                            {cargo.extra_extra_charges.length === 0 && (
                              <small className="text-dark fw-semibold">{currency_symbols(cargo.invoice.currency_code)}0.00</small>
                            )}
                            {cargo.extra_extra_charges.length !== 0 && cargo.extra_extra_charges[0]['paid'] === 1 && (
                              <span class="badge badge-pill badge bg-success">Extra paid</span>
                            )}
                          </div>
                          {/* <div className="col-6 col-md-2"> */}


                          {/* <small role="button" onClick={() => trackCargo(cargo.tracking_number)} className="bt btn-link fw-semibold">{cargo.tracking_number}</small> */}
                          {/* </div> */}



                          {/* <div className="col-6 col-md-2 mb-3 mb-md-0">


                          </div> */}

                          <div className="col-6 col-md-2">
                            <small className="card-subtitle mb-0">created at:</small>
                            <small className="text-dark fw-semibold">
                              {
                                moment(cargo.created_at).format(
                                  "D MMMM, YYYY"
                                )
                              }
                              <br />
                              <span class="badge bg-primary badge-pill p-2" style={{ fontSize: "14px" }}>It's {cargo.status.charAt(0).toUpperCase() + cargo.status.toLowerCase().slice(1).split("_").join(" ")}!</span>
                            </small>
                          </div>
                          <div className="col-6 col-md-3 mb-3 mb-md-0">
                            {/* <small className="card-subtitle mb-0">Sender </small> */}
                            <OverlayTrigger
                              placement="auto"
                              trigger={["focus", "hover"]}
                              overlay={(
                                <Popover>
                                  <Popover.Title as="h6">
                                    Sender address
                                  </Popover.Title>
                                  <Popover.Content>
                                    <ul>
                                      <li style={{ fontSize: "13px" }}>
                                        Name: <b>{cargo.shipping_specs.sender_information.name}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Email: <b>{cargo.shipping_specs.sender_information.email}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        phone: <b>{cargo.shipping_specs.sender_information.phone}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Country code: <b>{cargo.shipping_specs.sender_information.address
                                          .country_code}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Address Line 1: <b>{cargo.shipping_specs.sender_information.address
                                          .address_line_1}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Address Line 2: <b>{cargo.shipping_specs.sender_information.address
                                          .address_line_2}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Postal code: <b>{cargo.shipping_specs.sender_information.address
                                          .postal_code}</b>
                                      </li>
                                    </ul>
                                  </Popover.Content>
                                </Popover>
                              )}>
                              <small className="text-dark fw-semibold">{flagEmoji(cargo.shipping_specs.route.source_country_code)} {cargo.shipping_specs.sender_information.name}</small>
                            </OverlayTrigger>
                            <i className="bi bi-arrow-down d-block w-full"></i>
                            {/* <small className="card-subtitle mb-0">Receiver </small> */}

                            <OverlayTrigger
                              placement="auto"
                              trigger={["focus", "hover"]}
                              overlay={(
                                <Popover>
                                  <Popover.Title as="h6">
                                    Receiver address
                                  </Popover.Title>
                                  <Popover.Content>
                                    <ul>
                                      <li style={{ fontSize: "13px" }}>
                                        Name: <b>{cargo.shipping_specs.receiver_information.name}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Email: <b>{cargo.shipping_specs.receiver_information.email}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        phone: <b>{cargo.shipping_specs.receiver_information.phone}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Country code: <b>{cargo.shipping_specs.receiver_information.address
                                          .country_code}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Address Line 1: <b>{cargo.shipping_specs.receiver_information.address
                                          .address_line_1}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Address Line 2: <b>{cargo.shipping_specs.receiver_information.address
                                          .address_line_2}</b>
                                      </li>
                                      <li style={{ fontSize: "13px" }}>
                                        Postal code: <b>{cargo.shipping_specs.receiver_information.address
                                          .postal_code}</b>
                                      </li>
                                    </ul>
                                  </Popover.Content>
                                </Popover>
                              )}>
                              <small className="text-dark fw-semibold">{flagEmoji(cargo.shipping_specs.route.destination_country_code)} {cargo.shipping_specs.receiver_information.name}</small>
                            </OverlayTrigger>
                          </div>
                          <div className="col-6 col-md-2 mb-3 mb-md-0">
                            <button className="btn btn-link btn-sm mb-2 text-danger " onClick={() => openNotesModalModal({ tracking: cargo.tracking_number, staff: cargo.staff, notes: cargo.web_notes.concat(cargo?.book_notes) })}>
                              View notes({cargo.book_notes.concat(cargo?.web_notes).length})
                            </button>
                          </div>
                        </div>

                        <hr />
                        {cargo.extra_extra_charges.length !== 0 && cargo.extra_extra_charges[0]['paid'] === 0 && (
                          <div className="col-md-12 text-end">
                            <ul className="">
                              <li className="mb-2 btn btn-sm btn-danger  text-white me-2">
                                <a className="text-white" href={process.env.REACT_APP_API + "/billing/payment/extra?invoice_id=" + cargo.invoice.invoice_id} target="_blank">
                                  <i className="bi bi-cash-stack"></i> Pay extra charges with stripe
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                        <div className="row">
                          <div className="col-md-12 text-end">
                            <ul className="">


                              {cargo.invoice.payment_status == 'PENDING' && (
                                <>
                                  {cargo.invoice.discount_amount === 0 ? (
                                    <li className="mb-2 btn btn-sm btn-warning me-2">
                                      <a className="text-dark" onClick={() => (setApplyCouponData({ ...applyCouponData, tracking: cargo.tracking_number }), openApplyCouponsModal())}>
                                        <i className="bi bi-ticket-perforated"></i> Apply coupon
                                      </a>
                                    </li>
                                  ) : (
                                    <li className="mb-2 btn btn-sm btn-light me-2 disabled">
                                      <a className="text-dark">
                                        <i className="bi bi-ticket-perforated"></i> Coupon Applied ({currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.discount_amount})
                                      </a>
                                    </li>
                                  )}

                                  <li className="mb-2 btn btn-sm btn-danger  text-white me-2">
                                    <a className="text-white" href={process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.invoice.invoice_id} target="_blank">
                                      <i className="bi bi-cash-stack"></i> Pay with stripe
                                    </a>
                                  </li>
                                  {cargo.checkout.length > 1 && (
                                    <li className="mb-2 btn btn-sm btn-danger text-white me-2">
                                      <a className="text-white" href={process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.checkout.join(',')} target="_blank">
                                        <i className="bi bi-cash-stack"></i> Pay for all {cargo.checkout.length} parcels
                                      </a>
                                    </li>
                                  )}

                                  {cargo.status !== 'RELEASED' && (
                                    <li onClick={() => uploadInvoice(cargo)} className="mb-2 btn btn-sm btn-outline-dark  me-2">
                                      <i className="bi bi-receipt"></i> &nbsp;Upload invoice ({cargo.customer_invoices.length})
                                    </li>
                                  )}
                                  {isCargoOnCart(cargo) === false && (
                                    <li onClick={() => handleAddCart(cargo)} className="mb-2 btn btn-sm btn-outline-dark "><i className="bi bi-cart-check"></i>&nbsp;
                                      Add to cart
                                    </li>
                                  )}
                                  {isCargoOnCart(cargo) === true && (
                                    <li onClick={() => handleRemoveCart(cargo)} className="mb-2 btn btn-sm btn-success  text-white"><i className="bi bi-check-lg"></i>
                                      Added on cart
                                    </li>
                                  )}

                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {!loading && parcels && parcels.length == 0 && (
                    <div className="alert alert-warning mt-2 w-100 d-inline-block mx-auto text-center" role="alert">
                      Parcels not found
                    </div>
                  )}


                </ul>
                <div className="text-center">
                  <nav aria-label="Page navigation" className="pb-4 d-inline-block">
                    <ul className="pagination justify-content-center">
                      <li className={"page-item" + (filter.start == "0" ? " disabled" : "")}>
                        <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                      </li>
                      <li className={"page-item" + (parcels == null || parcels.length == 0 ? " disabled" : "")}>
                        <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="tab-pane fade" id="accountOrdersTwo" role="tabpanel" aria-labelledby="accountOrdersTwo-tab">
                <div className="text-center content-space-1">
                  <img className="avatar avatar-xl mb-3" src="@@autopath/assets/svg/illustrations/empty-state-no-data.svg" alt="Image Description" />
                  <p className="card-text">No data to show</p>
                  <a className="btn btn-white btn-sm" href="#">Start shopping</a>
                </div>
              </div>

              <div className="tab-pane fade" id="accountOrdersThree" role="tabpanel" aria-labelledby="accountOrdersThree-tab">
                <div className="text-center content-space-1">
                  <img className="avatar avatar-xl mb-3" src="@@autopath/assets/svg/illustrations/empty-state-no-data.svg" alt="Image Description" />
                  <p className="card-text">No data to show</p>
                  <a className="btn btn-white btn-sm" href="#">Start shopping</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal2 header="Public Tracking" id="public_tracking">
        <div className="container justify-content-center bg-light">
          <ul className="step step-md step-centered">
            {steps.map((step, i) => {
              const passed = step.value in itemHistory;
              // console.log(step.value, passed);
              const date = passed
                ? moment(itemHistory[step.value].at).format(
                  "Do of MMM YYYY, h:mm a"
                )
                : null;
              return (
                <li className="step-item" key={i}>
                  <div className="step-content-wrapper">
                    <span
                      className={`step-icon step-icon${passed ? "" : "-soft"}${lastEvent === step.value
                        ? isDelayed
                          ? "-danger"
                          : "-success"
                        : "-navy"
                        }`}
                    >
                      {i + 1}
                    </span>
                    <div className="step-content">
                      <h4>{step.label}</h4>
                      {lastEvent === step.value && isDelayed && (
                        <small>
                          <b>Item is delayed</b>
                          <br />
                        </small>
                      )}
                      {date && (
                        <small style={{ fontSize: "0.7em" }}>{date}</small>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal2>

      <Modal
        size="md"
        onHide={CloseUploadInvoice}
        show={showUploadInvoice}
        aria-labelledby="create-route-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="create-route-title">Upload invoice</Modal.Title>
        </Modal.Header>

        <Modal.Body align="center">
          <>
            <ol>
              {selectedCargoInvoice !== null && selectedCargoInvoice.customer_invoices.map((customerInvoiceItem, i) =>
                <li style={{ fontSize: "13px" }}><a role="button" className="btn-link text-primary" onClick={() => openInNewTab(process.env.REACT_APP_API + '/customer/invoice?file=' + customerInvoiceItem)}>{customerInvoiceItem}</a></li>
              )}
            </ol>
            <small>Invoice must be image or pdf format.</small>
            <div className="form-group mt-2">
              <label className="btn btn-secondary" htmlFor="my-file-selector">
                <input id="my-file-selector" type="file" className="d-none" onChange={(event) => handleInvoiceChange(event)} disabled={(selectedCargoInvoice !== null && selectedCargoInvoice.customer_invoices.length === 5) ? "disabled" : ""} />
                {selectedCargoInvoice !== null && selectedCargoInvoice.customer_invoices.length === 5 && (
                  "Can't upload more than 5 files"
                )}
                {selectedCargoInvoice !== null && selectedCargoInvoice.customer_invoices.length < 5 && (
                  "Choose file"
                )}
              </label>
            </div>
          </>
        </Modal.Body>
      </Modal>

      {activeNotes && activeNotes.notes.length > 0 && (
        <BookNotesModalClient
          activeNotes={{ ...activeNotes, notes: activeNotes.notes }}
          closeNotesModalModal={closeNotesModalModal}
          showNotesModal={showNotesModal}
          openNotesModalModal={openNotesModalModal}
          auth={auth}
          setActiveNotes={setActiveNotes}
          books={parcels}
          setBooks={setParcels}
          canAddNote={false}
        />
      )}


      <Modal
        size="md"
        onHide={closeApplyCouponsModal}
        show={applyingCoupon}
        aria-labelledby="enter-receiver-address"
        centered
      >
        <Modal.Header closeButton
          className="">
          <Modal.Title id="create-route-title" className="">Choose from your coupons or enter it manually</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            {coupons && coupons.length > 0 && coupons.map((cp, i) => (
              <div
                role="button"
                onClick={() => setApplyCouponData({ ...applyCouponData, coupon: cp.code })}
                className="shadow-sm badge bg-warning text-dark me-2 mb-1">{cp.code} (Amount: {JSON.parse(cp.metadata).percent})</div>
            ))}
            {coupons && coupons.length > 0 && (
              <hr />
            )}
            <div class="form-floating mb-4 mt-2">
              <input
                value={applyCouponData.coupon}
                onChange={(e) => setApplyCouponData({ ...applyCouponData, coupon: e.target.value })}
                type="text" name="code" id="weight" class="form-control form-control-lg shadow-none" placeholder="Coupon code" />
              <label class="form-label" for="weight">Coupon code</label>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-secondary btn-sm float-end "
            onClick={() => handleApplyCoupon()}
            disabled={false}
          >
            {handleApplyCoupon ? (
              "Apply"
            ) : (
              <Spinner animation="border" size="sm" />
            )}
          </Button>
          <button className="btn btn-sm btn-white " onClick={() => closeApplyCouponsModal()}>Close</button>

        </Modal.Footer>
      </Modal>
    </>

    // </div>
  );
}

export default ClientParcels;