import getDelayedInactive from "requests/getDelayedInactive";
import { useRequest } from "hooks";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Col, Row, Button, Table, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import { currency_symbols } from "utils/Currency";
import { AuthContext } from "context";
import BookNotesModal from "components/BookNotesModal";
import copy from "copy-to-clipboard";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const DelayInactive = () => {
    const { auth, auth: { routes, accountType, accountId } } = useContext(AuthContext);
    const viewInactive = auth.staff.privileges.includes('VIEW_INACTIVE');
    const viewDelayed = auth.staff.privileges.includes('VIEW_DELAY');
    const isAdmin = auth.accountType === "ADMIN" && auth.accountId === "1";
    const isSubAdmin = auth.staff.privileges.includes('SUB_ADMIN');
    const [customers, setCustomers] = useState([]);
    const [delay, setDelay] = useState([]);
    const [activeNotes, setActiveNotes] = useState(null);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [req, setReq] = useState({
        limit: 10,
        registered: 0,
        time: 0,
        time_by: 'month',
        start: 0
    });
    const [getDelayedInactiveReq] = useRequest(getDelayedInactive);

    const openNotesModalModal = (book) => {
        setActiveNotes(book);
        setShowNotesModal(true);
    };

    const closeNotesModalModal = () => {
        setShowNotesModal(false);
    };

    const handleNext = () => {
        setReq({ ...req, start: (parseInt(req.start) + req.limit) });
    };

    const handlePrev = () => {
        let strt = parseInt(req.start) < req.limit ? 0 : parseInt(req.start) - req.limit;
        setReq({ ...req, start: strt });
    };

    const getData = () => {
        getDelayedInactiveReq(req)
            .then(response => {
                setDelay(response.data.delay);
                setCustomers(response.data.customers);
            });
    };

    useEffect(() => {
        getData();
    }, [req.start]);
    return (
        <div className="row">
            <Row className={"mb-3"}>
                <Col xs={12} md={2} lg={2}>
                    <label htmlFor="dateFrom">Inactive For:</label>
                    <input type={"text"} id="time" className={"form-control"} value={req.time} onChange={({ target: { value } }) => { setReq({ ...req, time: value }) }} />
                </Col>
                <Col xs={12} md={4} lg={2}>
                    <label htmlFor="dateFrom">&nbsp;</label>
                    <div className="btn-group form-control p-0" role="group" aria-label="Basic example">
                        <button type="button"
                            onClick={() => setReq({ ...req, time_by: 'month' })}
                            className={"btn btn-outline-secondary " + (req.time_by === 'month' ? 'active' : '')}>month</button>
                        <button type="button"
                            onClick={() => setReq({ ...req, time_by: 'week' })}
                            className={"btn btn-outline-secondary " + (req.time_by === 'week' ? 'active' : '')}>week</button>
                    </div>
                </Col>
                <Col xs={12} md={4} lg={2}>
                    <label htmlFor="dateFrom">Clients:</label>
                    <div className="btn-group form-control p-0" role="group" aria-label="Basic example">
                        <button type="button"
                            onClick={() => setReq({ ...req, registered: 0 })}
                            className={"btn btn-outline-secondary " + (req.registered === 0 ? 'active' : '')}>All</button>
                        <button type="button"
                            onClick={() => setReq({ ...req, registered: 1 })}
                            className={"btn btn-outline-secondary " + (req.registered === 1 ? 'active' : '')}>Registered</button>
                    </div>
                </Col>
                <Col xs={12} md={2}>
                    <label>&nbsp;</label>
                    <ButtonGroup className={"d-flex align-items-end"}>
                        <Button variant={"primary"} block onClick={() => getData()}>Filter</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                {(isAdmin || isSubAdmin || viewInactive) && (
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="Inactive-tab" data-bs-toggle="tab" data-bs-target="#Inactive-tab-pane" type="button" role="tab" aria-controls="Inactive-tab-pane" aria-selected="true">Inactive</button>
                    </li>
                )}
                {(isAdmin || isSubAdmin || viewDelayed) && (

                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="Delayed-tab" data-bs-toggle="tab" data-bs-target="#Delayed-tab-pane" type="button" role="tab" aria-controls="Delayed-tab-pane" aria-selected="false">Delayed</button>
                    </li>
                )}
            </ul>

            <div className="tab-content" id="myTabContent">
                {(isAdmin || isSubAdmin || viewInactive) && (

                    <div className="tab-pane fade show active" id="Inactive-tab-pane" role="tabpanel" aria-labelledby="Inactive-tab" tabindex="0">
                        <div className="col-12 bg-white p-4">
                            {customers && (
                                <div className="text-center mb-2 mt-2">
                                    <nav aria-label="Page navigation" className="d-inline-block">
                                        <ul className="pagination">
                                            <li className={"page-item" + (req.start == "0" ? " disabled" : "")}>
                                                <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                                            </li>
                                            <li className={"page-item" + ((customers.length < 1 || customers.length < req.limit) ? " disabled" : "")}>
                                                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                            <Table responsive striped bordered hover className={"items-table"}>
                                <thead>
                                    <tr>
                                        <th>Registered</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Name</th>
                                        <th>Inactive</th>
                                        <th>Parcels</th>
                                        <th>Paid(all currency)</th>
                                        <th>Weight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers && customers.length > 0 && customers.map((c, i) => (
                                        <tr key={i}>
                                            <td style={{ fontSize: "18px" }}>{c.id === null ? <i className="text-danger bi bi-x-square-fill"></i> : <i className="text-success bi bi-check-square-fill"></i>} </td>
                                            <td><Link className="text-dark fw-bold" style={{ fontSize: "16px" }} to={`/manage/client/${btoa(c.email)}`}>

                                                {c.email}</Link></td>
                                                <td>{c.phone}</td>
                                            <td>
                                                {c.name}
                                            </td>
                                            <td>

                                                <OverlayTrigger
                                                    placement="auto"
                                                    trigger={["focus", "hover"]}
                                                    overlay={(
                                                        <Popover>
                                                            <Popover.Title>
                                                                Last active
                                                            </Popover.Title>
                                                            <Popover.Content>
                                                                <p>{moment(c.inactive_since).format(
                                                                    "Do of MMM YYYY, h:mm a"
                                                                )}</p>
                                                            </Popover.Content>
                                                        </Popover>
                                                    )}>
                                                    <div role="button">
                                                        {moment(c.inactive_since).fromNow()}
                                                    </div>
                                                </OverlayTrigger>
                                            </td>
                                            <td>
                                                {c.total_parcels}
                                            </td>
                                            <td>
                                                {c.cargo_total_price}

                                            </td>
                                            <td>
                                                {c.cargo_weight_total}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {customers && (
                                <div className="text-center mb-2 mt-2">
                                    <nav aria-label="Page navigation" className="d-inline-block">
                                        <ul className="pagination">
                                            <li className={"page-item" + (req.start == "0" ? " disabled" : "")}>
                                                <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                                            </li>
                                            <li className={"page-item" + ((customers.length < 1 || customers.length < req.limit) ? " disabled" : "")}>
                                                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {(isAdmin || isSubAdmin || viewDelayed) && (
                    <div className="tab-pane fade" id="Delayed-tab-pane" role="tabpanel" aria-labelledby="Delayed-tab" tabindex="0">
                        <div className="col-12 bg-white p-4">
                            {delay && (
                                <div className="text-center mb-2 mt-2">
                                    <nav aria-label="Page navigation" className="d-inline-block">
                                        <ul className="pagination">
                                            <li className={"page-item" + (req.start == "0" ? " disabled" : "")}>
                                                <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                                            </li>
                                            <li className={"page-item" + ((delay.length < 1 || delay.length < req.limit) ? " disabled" : "")}>
                                                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                            <Table responsive striped bordered hover className={"items-table"}>
                                <thead>
                                    <tr>
                                        <th>Tracking</th>
                                        <th>Sender</th>
                                        <th>Receiver</th>
                                        <th>Invoice</th>
                                        <th>Collection/Status</th>
                                        <th>Weight</th>
                                        <th>Notes</th>
                                        <th>Links</th>
                                        <th>Delay Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {delay && delay.length > 0 && delay.map((c, i) => (
                                        <tr key={i}>
                                            <td>{c.tracking_number} </td>
                                            <td>
                                                <Link to={`/manage/client/${btoa(c.email)}`}>{c.sender_name}</Link>
                                                <OverlayTrigger
                                                    placement="auto"
                                                    trigger={["focus", "hover"]}
                                                    overlay={(
                                                        <Popover>
                                                            <Popover.Title>
                                                                Details
                                                            </Popover.Title>
                                                            <Popover.Content>
                                                                <ul>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Name: <b>{c.sender_name}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Email: <b>{c.sender_email}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        phone: <b>{c.sender_phone}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Country code: <b>{c.sender_address_country_code}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Address Line 1: <b>{c.sender_address_line_1}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Address Line 2: <b>{c.sender_address_line_2}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Postal code: <b>{c.sender_address_postal_code}</b>
                                                                    </li>
                                                                </ul>
                                                            </Popover.Content>
                                                        </Popover>
                                                    )}>
                                                    <small className="btn btn-link text-dark ms-1 p-0" >
                                                        <i className="bi bi-info-square"></i>
                                                    </small>
                                                </OverlayTrigger>

                                            </td>
                                            <td>
                                                {c.receiver_name}
                                                <OverlayTrigger
                                                    placement="auto"
                                                    trigger={["focus", "hover"]}
                                                    overlay={(
                                                        <Popover>
                                                            <Popover.Title>
                                                                Details
                                                            </Popover.Title>
                                                            <Popover.Content>
                                                                <ul>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Name: <b>{c.receiver_name}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Email: <b>{c.receiver_email}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        phone: <b>{c.receiver_phone}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Country code: <b>{c.receiver_address_country_code}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Address Line 1: <b>{c.receiver_address_line_1}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Address Line 2: <b>{c.receiver_address_line_2}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Postal code: <b>{c.receiver_address_postal_code}</b>
                                                                    </li>
                                                                </ul>
                                                            </Popover.Content>
                                                        </Popover>
                                                    )}>
                                                    <small className="btn btn-link text-dark ms-1 p-0" >
                                                        <i className="bi bi-info-square"></i>
                                                    </small>
                                                </OverlayTrigger>
                                            </td>
                                            <td>
                                                <OverlayTrigger
                                                    placement="auto"
                                                    trigger={["focus", "hover"]}
                                                    overlay={(
                                                        <Popover>
                                                            <Popover.Title as="h6">
                                                                Invoice
                                                            </Popover.Title>
                                                            <Popover.Content>
                                                                <ul>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Weight: <b>{c.item_weight.toFixed(2)}kg</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Freight Price: <b>{currency_symbols(c.invoice_currency_code)}{c.invoice_freight_price.toFixed(2)}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Delivery Price: <b>{currency_symbols(c.invoice_currency_code)}{c.invoice_delivery_price.toFixed(2)}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Packaging Price: <b>{currency_symbols(c.invoice_currency_code)}{c.invoice_packaging_price?.toFixed(2)}</b>
                                                                    </li>

                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Discount: <b>{currency_symbols(c.invoice_currency_code)}{c.invoice_discount.toFixed(2)}</b>
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        {JSON.parse(c.invoice_extra_charges).length > 0 && (
                                                                            <div>
                                                                                Extra Charges: <b>{JSON.parse(c.invoice_extra_charges).map((ex, i) => (
                                                                                    <span className="badge text-bg-primary">{ex.note}: {currency_symbols(c.invoice_currency_code)}{ex.amount.toFixed(2)}</span>
                                                                                ))}</b>
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                    <li style={{ fontSize: "13px" }}>
                                                                        Total Amount: <b>{currency_symbols(c.invoice_currency_code)}{(c.invoice_freight_price + c.invoice_delivery_price + c.invoice_packaging_price - c.invoice_discount + JSON.parse(c.invoice_extra_charges).reduce((n, { amount }) => n + amount, 0)).toFixed(2)}</b>
                                                                    </li>

                                                                </ul>
                                                            </Popover.Content>
                                                        </Popover>
                                                    )}>
                                                    <div role="button">
                                                        {c.payment_status === 'PAID' ?
                                                            (
                                                                <div style={{ fontSize: "12px" }} className="badge bg-success me-1">Paid {currency_symbols(c.invoice_currency_code)}{(c.invoice_freight_price + c.invoice_delivery_price + c.invoice_packaging_price - c.invoice_discount + JSON.parse(c.invoice_extra_charges).reduce((n, { amount }) => n + amount, 0)).toFixed(2)}</div>
                                                            )
                                                            : (
                                                                <div style={{ fontSize: "12px" }} className="badge bg-danger me-1">Unpaid {currency_symbols(c.invoice_currency_code)}{(c.invoice_freight_price + c.invoice_delivery_price + c.invoice_packaging_price - c.invoice_discount + JSON.parse(c.invoice_extra_charges).reduce((n, { amount }) => n + amount, 0)).toFixed(2)}</div>
                                                            )}
                                                        <div style={{ fontSize: "12px" }} className="badge bg-primary me-1">{c.payment_method}</div>
                                                    </div>
                                                </OverlayTrigger>
                                            </td>
                                            <td>
                                                {c.collection_option === 'HOME' ? (
                                                    <div style={{ fontSize: "12px" }} className="badge bg-primary me-1">Home</div>

                                                ) : (
                                                    <div style={{ fontSize: "12px" }} className="badge bg-success me-1">Office</div>
                                                )}
                                                {c.events && c.events.length > 0 ? (

                                                    <OverlayTrigger
                                                        placement="auto"
                                                        trigger={["focus", "hover"]}
                                                        overlay={(
                                                            <Popover>
                                                                <Popover.Title as="h6">
                                                                    Events history
                                                                </Popover.Title>
                                                                <Popover.Content>
                                                                    <section className="py-1">
                                                                        <ul className="timeline-with-icons">
                                                                            {c.events.map((ev, i) => (
                                                                                <li className="timeline-item mb-2">
                                                                                    <span className="timeline-icon">
                                                                                        <h5 className="fw-bold"><i className="bi bi-calendar-event"></i> {ev.type}</h5>
                                                                                    </span>

                                                                                    <small className="text-muted mb-2 fw-bold">
                                                                                        {ev.username} at {" "}
                                                                                        {moment(ev.created_at).format(
                                                                                            "D MMMM, YYYY, h:mm:ss a"
                                                                                        )}
                                                                                    </small>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </section>
                                                                </Popover.Content>
                                                            </Popover>
                                                        )}>
                                                        <div role="button" style={{ fontSize: "12px" }} className="badge bg-dark me-1">{c.status}</div>
                                                    </OverlayTrigger>
                                                ) : (
                                                    <div role="button" style={{ fontSize: "12px" }} className="badge bg-dark me-1">{c.status}</div>
                                                )}

                                            </td>
                                            <td>
                                                <b>{c.item_weight.toFixed(2)}kg</b>
                                                {/* <OverlayTrigger
                                    placement="auto"
                                    trigger={["focus", "hover"]}
                                    overlay={(
                                        <Popover>
                                            <Popover.Title>
                                                Time
                                            </Popover.Title>
                                            <Popover.Content>
                                                <p>{c.created_at}</p>
                                            </Popover.Content>
                                        </Popover>
                                    )}>
                                    <div role="button">
                                        {moment(c.created_at).fromNow()}
                                    </div>
                                </OverlayTrigger> */}
                                            </td>
                                            <td>
                                                {c.notes === '' ? (
                                                    <div
                                                        role="button"
                                                        onClick={() => openNotesModalModal({ tracking: c.tracking_number, staff: c.staff, notes: c.web_notes.concat(c.book_notes) })}
                                                        style={{ fontSize: "13px" }} className={"badge me-1 bg-warning text-dark " + (c.web_notes.concat(c.book_notes).filter(mp => mp.body.includes('@[' + auth.staff.username + ']')).length > 0 && c.web_notes[0]?.seen === 0 ? 'shake ' : '')}>Notes({(c.web_notes.concat(c.book_notes)?.length + (c.notes === '' ? 0 : 1)) > 9 ? '9+' : c.web_notes.concat(c.book_notes)?.length + (c.notes === '' ? 0 : 1)})</div>
                                                ) : (
                                                    <OverlayTrigger
                                                        placement="auto"
                                                        trigger={["focus", "hover"]}
                                                        overlay={(
                                                            <Popover>
                                                                <Popover.Title as="h6">
                                                                    Notes
                                                                </Popover.Title>
                                                                <Popover.Content>
                                                                    {c.notes}
                                                                </Popover.Content>
                                                            </Popover>
                                                        )}>
                                                        <div
                                                            role="button"
                                                            onClick={() => openNotesModalModal({ tracking: c.tracking_number, staff: c.staff, notes: c.web_notes.concat(c.book_notes) })}
                                                            style={{ fontSize: "13px" }} className={"badge me-1 bg-warning text-dark " + (c.web_notes.concat(c.book_notes).filter(mp => mp.body.includes('@[' + auth.staff.username + ']')).length > 0 && c.web_notes[0]?.seen === 0 ? 'shake ' : '')}>Notes({(c.web_notes.concat(c.book_notes)?.length + (c.notes === '' ? 0 : 1)) > 9 ? '9+' : c.web_notes.concat(c.book_notes)?.length + (c.notes === '' ? 0 : 1)})</div>
                                                    </OverlayTrigger>
                                                )}
                                            </td>
                                            <td>
                                                <a role="button" target="_blank" className="text-primary" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + c.invoice_id), toast.success("Copied to clipboard!", toastOptions))}>Stripe Link <i className="bi bi-subtract"></i></a>
                                                {c.checkout.length > 1 && (
                                                    <>
                                                        <br />
                                                        <a role="button" target="_blank" className="text-danger" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + c.checkout.join(',')), toast.success("Copied to clipboard!", toastOptions))}>Checkout Link <i className="bi bi-subtract"></i></a>
                                                    </>
                                                )}
                                            </td>
                                            <td>
                                                <OverlayTrigger
                                                    placement="auto"
                                                    trigger={["focus", "hover"]}
                                                    overlay={(
                                                        <Popover>
                                                            <Popover.Title>
                                                                Delay Date
                                                            </Popover.Title>
                                                            <Popover.Content>
                                                                <p>{moment(c.delay_date).format(
                                                                    "Do of MMM YYYY, h:mm a"
                                                                )}</p>
                                                            </Popover.Content>
                                                        </Popover>
                                                    )}>
                                                    <div role="button">
                                                        {moment(c.delay_date).fromNow()}
                                                    </div>
                                                </OverlayTrigger>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {delay && (
                                <div className="text-center mb-2 mt-2">
                                    <nav aria-label="Page navigation" className="d-inline-block">
                                        <ul className="pagination">
                                            <li className={"page-item" + (req.start == "0" ? " disabled" : "")}>
                                                <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                                            </li>
                                            <li className={"page-item" + ((delay.length < 1 || delay.length < req.limit) ? " disabled" : "")}>
                                                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>


            {activeNotes && (
                <BookNotesModal
                    activeNotes={activeNotes}
                    closeNotesModalModal={closeNotesModalModal}
                    showNotesModal={showNotesModal}
                    openNotesModalModal={openNotesModalModal}
                    auth={auth}
                    setActiveNotes={setActiveNotes}
                    books={delay}
                    setBooks={setDelay}
                    canAddNote={true}
                />
            )}
        </div>
    );
};

export default DelayInactive;