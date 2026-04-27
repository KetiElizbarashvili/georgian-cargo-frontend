import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory, Link } from 'react-router-dom';
import useRequest from "../../hooks/useRequest";
import cargosRequest from "requests/cargosStaff";
import { ButtonGroup, Col, Row, Spinner } from "react-bootstrap";
import { flagEmoji } from "utils/FlagEmoji";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button';
import { currency_symbols } from "utils/Currency";
import moment from "moment";

const initFilter = { start: 0, payment_status: "", query: "", limit: 9, customerId: null };

function ClientParcelsForStaff() {
    const [getCargos] = useRequest(cargosRequest);
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        setFilter({ ...initFilter, customerId: params.id });
    }, []);

    useEffect(() => {
        getCargosHandler();
    }, [filter]);

    const getCargosHandler = () => {
        getCargos({ ...filter })
            .then((data) => {
                setParcels(data.data.cargos);
                setLoading(false);
            })
            .catch((e) => console.error(e, 999));
    };

    const handleNext = () => {
        setFilter({ ...filter, start: (parseInt(filter.start) + parseInt(filter.limit)) });
    };

    const handlePrev = () => {
        let start = parseInt(filter.start) < parseInt(filter.limit) ? 0 : parseInt(filter.start) - parseInt(filter.limit);
        setFilter({ ...filter, start: start.toString() });
    };

    const updateFilter = ({ key, value }) => {
        setFilter({ ...filter, [key]: value });
    };

    const resetFilter = () => {
        setFilter({ ...initFilter, customerId: params.id });
    };
    const handleFilter = () => {
        // setFilter({ ...initFilter, customerId: params.id });
    };

    const handleSearch = (val) => {
        // console.log(val);
        setFilter({ ...filter, query: val });
    };

    return (
        <div className="card border-0 shadow-none" >
            {filter && (
                <Row className={"mb-3"}>
                    <Col xs={6} md={4} lg={2}>
                        <label htmlFor="paymentFilter">Payment status</label>
                        <select className={"form-control"} id="paymentFilter"
                            value={filter.payment_status}
                            onChange={({ target: { value } }) => { updateFilter({ key: 'payment_status', value: value }) }}>
                            <option value="">All</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Not Paid</option>
                        </select>
                    </Col>
                    {/* <div className="w-100 d-none d-lg-block" /> */}
                    <Col xs={4} className="">
                        <label>&nbsp;</label>
                        <ButtonGroup className={"d-flex align-items-end"}>
                            <Button variant={"primary"} block onClick={handleFilter}>Filter</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            )}
            {filter && parcels && (
                <div className="text-center mb-2">
                    <nav aria-label="Page navigation" className="d-inline-block">
                        <ul className="pagination">
                            <li className={"page-item"}>
                                <a className={"btn btn-primary p-2 " + (filter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                            </li>
                            <li className="page-item">
                                <a className={"btn btn-primary p-2 " + ((parcels.length < filter.limit || parcels.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
            <div className="table-responsive">
                <table className="table table-striped align-items-center table-flush">
                    <thead className="thead-light">
                        <tr>
                            <th className="border-bottom" scope="col">Tracking number</th>
                            <th className="border-bottom" scope="col">Source Country</th>
                            <th className="border-bottom" scope="col">Destination Country</th>
                            <th className="border-bottom" scope="col">Invoice</th>
                            <th className="border-bottom" scope="col">Collection Option</th>
                            <th className="border-bottom" scope="col">Status</th>
                            <th className="border-bottom" scope="col">Payment Status</th>
                            <th>Total Amount</th>
                            <th className="border-bottom" scope="col">Release Code</th>
                            <th className="border-bottom" scope="col">Handled by</th>
                            <th className="border-bottom" scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!parcels) ? (
                            <Spinner />
                        ) : (
                            <>
                                {parcels && parcels.length > 0 && parcels.map((parcel, i) => (
                                    <tr key={i}>
                                        <td className="text-gray-900" scope="row">
                                            <a href={`/manage/item/${parcel.tracking_number}`}>{parcel.tracking_number}</a>

                                        </td>
                                        <td className="fw-bolder text-gray-500">
                                            {flagEmoji(parcel.shipping_specs.route.source_country_code)}
                                            <OverlayTrigger
                                                placement="auto"
                                                trigger="click"
                                                overlay={(
                                                    <Popover>
                                                        <Popover.Title as="h6">
                                                            Sender address
                                                        </Popover.Title>
                                                        <Popover.Content>
                                                            <ul>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Name: <b>{parcel.shipping_specs.sender_information.name}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Email: <b>{parcel.shipping_specs.sender_information.email}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    phone: <b>{parcel.shipping_specs.sender_information.phone}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Country code: <b>{parcel.shipping_specs.sender_information.address.country_code}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 1: <b>{parcel.shipping_specs.sender_information.address.address_line_1}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 2: <b>{parcel.shipping_specs.sender_information.address.address_line_2}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Postal code: <b>{parcel.shipping_specs.sender_information.address.postal_code}</b>
                                                                </li>
                                                            </ul>
                                                        </Popover.Content>
                                                    </Popover>
                                                )}>
                                                <Button variant="link" style={{ fontSize: "12px" }}>
                                                    View address
                                                </Button>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="fw-bolder text-gray-500">
                                            {flagEmoji(parcel.shipping_specs.route.destination_country_code)}
                                            <OverlayTrigger
                                                placement="auto"
                                                trigger="click"
                                                overlay={(
                                                    <Popover>
                                                        <Popover.Title as="h6">
                                                            Sender address
                                                        </Popover.Title>
                                                        <Popover.Content>
                                                            <ul>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Name: <b>{parcel.shipping_specs.receiver_information.name}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Email: <b>{parcel.shipping_specs.receiver_information.email}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    phone: <b>{parcel.shipping_specs.receiver_information.phone}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Country code: <b>{parcel.shipping_specs.receiver_information.address.country_code}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 1: <b>{parcel.shipping_specs.receiver_information.address.address_line_1}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 2: <b>{parcel.shipping_specs.receiver_information.address.address_line_2}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Postal code: <b>{parcel.shipping_specs.receiver_information.address.postal_code}</b>
                                                                </li>
                                                            </ul>
                                                        </Popover.Content>
                                                    </Popover>
                                                )}>
                                                <Button variant="link" style={{ fontSize: "12px" }}>
                                                    View address
                                                </Button>
                                            </OverlayTrigger>
                                        </td>
                                        <td>
                                            <OverlayTrigger
                                                placement="auto"
                                                trigger="click"
                                                overlay={(
                                                    <Popover>
                                                        <Popover.Title as="h6">
                                                            Invoice
                                                        </Popover.Title>
                                                        <Popover.Content>
                                                            <ul>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Freight Price: <b>{currency_symbols(parcel.invoice.currency_code)}{parcel.invoice.freight_price.toFixed(2)}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Delivery Price: <b>{currency_symbols(parcel.invoice.currency_code)}{parcel.invoice.delivery_price.toFixed(2)}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Packaging Price: <b>{currency_symbols(parcel.invoice.currency_code)}{parcel.invoice.packaging_price.toFixed(2)}</b>
                                                                </li>

                                                                <li style={{ fontSize: "13px" }}>
                                                                    Discount: <b>{currency_symbols(parcel.invoice.currency_code)}{parcel.invoice.discount_amount.toFixed(2)}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    {parcel.invoice.extra_charges.length > 0 && (
                                                                        <div>
                                                                            Extra Charges: <b>{parcel.invoice.extra_charges.map((ex, i) => (
                                                                                <span className="badge text-bg-primary">{ex.note}: {currency_symbols(parcel.invoice.currency_code)}{ex.amount.toFixed(2)}</span>
                                                                            ))}</b>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Total Amount: <b>{currency_symbols(parcel.invoice.currency_code)}{parcel.invoice.total_amount.toFixed(2)}</b>
                                                                </li>

                                                            </ul>
                                                        </Popover.Content>
                                                    </Popover>
                                                )}>
                                                <Button variant="link" style={{ fontSize: "12px" }}>
                                                    View invoice
                                                </Button>
                                            </OverlayTrigger>
                                        </td>
                                        <td>{parcel.shipping_specs.collection_option}</td>
                                        <td className="fw-bolder text-gray-500" style={{ textTransform: "capitalize" }}>
                                            {parcel.status.toLowerCase().replace('_', ' ')}
                                        </td>
                                        <td className="fw-bolder text-gray-500">
                                            {parcel.invoice.payment_status === 'PAID' ? (
                                                <span class="badge text-bg-success">{parcel.invoice.payment_status.toLowerCase()}</span>
                                            ) : (
                                                <span class="badge text-bg-warning">{parcel.invoice.payment_status.toLowerCase()}</span>
                                            )}

                                        </td>
                                        <td className={'fw-bold ' + parcel.invoice.payment_status !== 'PAID' ? 'text-danger' : 'text-success'}>{currency_symbols(parcel.invoice.currency_code)}{parcel.invoice.total_amount.toFixed(2)}</td>
                                        <td>{parcel.release_code}</td>
                                        <td>df sd fsdf</td>
                                        <td>
                                            {
                                                moment(parcel.created_at).format(
                                                    "D MMMM, YYYY - HH:mm"
                                                )
                                            }
                                        </td>
                                    </tr>

                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
            {filter && parcels && (
                <div className="text-center mb-2">
                    <nav aria-label="Page navigation" className="d-inline-block">
                        <ul className="pagination">
                            <li className={"page-item"}>
                                <a className={"btn btn-primary p-2 " + (filter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                            </li>
                            <li className="page-item">
                                <a className={"btn btn-primary p-2 " + ((parcels.length < filter.limit || parcels.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div >
    );

}

export default ClientParcelsForStaff;