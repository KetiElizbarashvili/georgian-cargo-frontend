import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row, Table, Modal, Carousel } from "react-bootstrap";
import "./ItemsTable.css"
import useRequest from "../../hooks/useRequest";
import GetItemsRequest from "../../routes/GetItemsRequest";
import GetItemsStatsRequest from "../../routes/GetItemsStatsRequest";
import GetAgentsRequest from "../../routes/GetAgentsRequest";
import { useAxios } from "../../hooks";
import { AuthContext } from "../../context";
import { Util } from "../../utils";
import downloadBase64File from "utils/base64ToFile"
import signatureRequest from "requests/signatureRequest";
import cargoPicturesRequest from "requests/cargoPicturesRequest";
import { deleteCustomerInvoiceRequest } from "requests/deleteCustomerInvoice"
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { copy } from "utils/copy";
import { flagEmoji } from "utils/FlagEmoji";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import { currency_symbols } from "utils/Currency";
import BookNotesModal from "components/BookNotesModal";

const initFilter = { Status: "", Agent: "", SourceCountryCode: "", DestinationCountryCode: "", from: "", to: "", PaymentMethod: "", PaymentStatus: "", CollectionOption: "" };
const initFilterSpecs = { filter_value: "", filter_by: "ALL" };
const initPagingSpecs = { page_offset: 0, page_size: 50 };

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

function ItemsTable() {
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showWebNotesModal, setShowWebNotesModal] = useState(false);
    const [activeNotes, setActiveNotes] = useState(null);
    const [webActiveNotes, setWebActiveNotes] = useState(null);
    const [stats, setStats] = useState({});
    const [cargos, setCargos] = useState([]);
    const [agents, setAgents] = useState([]);
    const [signature, setSignature] = useState(null);
    const [cargoPictures, setCargoPictures] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalForPictures, setShowModalForPictures] = useState(false);
    const [getSignature] = useRequest(signatureRequest);
    const [getCargoPictures] = useRequest(cargoPicturesRequest);
    const [deleteInvoice] = useRequest(deleteCustomerInvoiceRequest);
    const [getItems,] = useRequest(GetItemsRequest);
    const [getItemsStats,] = useRequest(GetItemsStatsRequest);
    const [getAgents,] = useRequest(GetAgentsRequest);
    const [filter, setFilter] = useState(initFilter);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSpecs, setFilterSpecs] = useState(initFilterSpecs);
    const [pagingSpecs, setPagingSpecs] = useState(initPagingSpecs);
    const { auth, auth: { routes, accountType, accountId } } = useContext(AuthContext);
    const amendCargoNotes = auth.staff.privileges.includes('EDIT_BOOKING_NOTES');
    const isAdmin = auth.accountType === "ADMIN" && auth.accountId === "1";
    const isSubAdmin = auth.staff.privileges.includes('SUB_ADMIN');

    const axiosInstance = useAxios();

    const handleCsvDownload = () => {
        axiosInstance({
            url: '/cargo',
            method: 'POST',
            responseType: 'blob',
            headers: {
                Accept: 'text/csv'
            },
            data: {
                filter_specification: filterSpecs,
                paging_specification: {
                    page_offset: 0,
                    page_size: 2000
                }
            }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'export.csv'); //or any other extension
            document.body.appendChild(link);
            link.click();
        }).catch((e) => {
            console.error(e);
        });
    };
    const loadAgents = () => {
        setAgents([]);
        getAgents().then(({ data }) => {
            setAgents(data.agents);
        }).catch((e) => { });
    }
    const loadItems = () => {
        setCargos([]);
        getItems({ ...filterSpecs, ...pagingSpecs }).then(({ data }) => {
            let crgs = data.cargos;
            console.log(data);
            crgs.map((element, i) => {
                if (crgs[i - 1] !== undefined) {
                    if (crgs[i - 1].shipping_specs.sender_information.email !== crgs[i].shipping_specs.sender_information.email && crgs[i - 1].shipping_specs.sender_information.name !== crgs[i].shipping_specs.sender_information.name) {
                        crgs[i].color = (crgs[i - 1].color === '#21325b' ? '#ad5fd4' : '#21325b');
                    } else if (crgs[i - 1].shipping_specs.sender_information.email === crgs[i].shipping_specs.sender_information.email && crgs[i - 1].shipping_specs.sender_information.name !== crgs[i].shipping_specs.sender_information.name) {
                        crgs[i].color = (crgs[i - 1].color === '#21325b' ? '#ad5fd4' : '#21325b');
                    } else {
                        crgs[i].color = crgs[i - 1].color;
                    }
                } else {
                    crgs[i].color = '#ad5fd4';
                }
            });
            // console.log(crgs);
            setCargos(crgs);
        }).catch((e) => { });
    }
    const loadStats = () => {
        setStats({});
        getItemsStats(filterSpecs).then(({ data }) => {
            setStats(data.stats);
        }).catch((e) => { });
    }

    const handleSearch = () => {
        setFilterSpecs({ filter_value: searchTerm, filter_by: "ALL" });
        setPagingSpecs(initPagingSpecs);
    };

    const handleFilter = () => {
        setFilterSpecs({ filter_value: Util.filterEmpty(filter), filter_by: "COMBINE" });
        setPagingSpecs(initPagingSpecs);
    };
    const resetFilter = () => {
        setFilterSpecs(initFilterSpecs);
        setPagingSpecs(initPagingSpecs);
        setFilter(initFilter);
    };
    const updateFilter = ({ key, value }) => {
        if (value) {
            setFilter((prev) => ({ ...prev, [key]: value }));
        } else {
            setFilter((prev) => {
                const { [key]: _, ...newFilter } = prev;
                return newFilter;
            });
        }
    }
    const closeModal = () => {
        setShowModal(false);
    };
    const closeCargoPicturesModal = () => {
        setShowModalForPictures(false);
    };


    const getSignatureHandler = (trackingNumber) => {
        getSignature({ ...{ trackingNumber: trackingNumber } })
            .then((response) => {
                setSignature(response.data);
                setTrackingNumber(trackingNumber);
                setShowModal(true);
            })
            .catch((e) => console.error(e, 999));
    };

    // console.log(response.data);
    const getPicturesHandler = (trackingNumber) => {
        getCargoPictures({ ...{ trackingNumber: trackingNumber } })
            .then((response) => {
                setCargoPictures(response.data.pictures);
                setShowModalForPictures(true);
            })
            .catch((e) => console.error(e, 999));
    };

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const openNotesWebModal = (cargo) => {
        setWebActiveNotes(cargo.cargo);
        setShowWebNotesModal(true);
    };

    const deleteCustomerInvoice = (name) => {
        deleteInvoice({ ...{ file_name: name } })
            .then((response) => {
                loadItems();
                toast.success("Invoice deleted!", toastOptions);
            })
            .catch((e) => {
                toast.error("Invoice was not deleted!", toastOptions);
                console.error(e, 999)
            });
    };

    const closeNotesModalModal = () => {
        setShowNotesModal(false);
    };

    const closeWebNotesModalModal = () => {
        setShowWebNotesModal(false);
    };

    const openNotesModalModal = (book) => {
        setActiveNotes(book);
        setShowNotesModal(true);
    };

    useEffect(() => {
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterSpecs, pagingSpecs]);

    useEffect(() => {
        console.log(filter);
    }, [filter]);

    useEffect(() => {
        loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterSpecs]);

    useEffect(() => {
        loadItems();
        loadAgents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <style>{`
ol.carousel-indicators > li {
    border: 1px solid black;
}
.carousel-control-prev-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
   }
   
   .carousel-control-next-icon {
     background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
   }
      `}
            </style>
            {cargoPictures && (

                <Modal show={showModalForPictures}>
                    <Modal.Header>
                        <Modal.Title>Pictures
                            <hr />
                            <small>Click on the image to download.</small>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Carousel variant="dark" interval={null}>
                            {cargoPictures.map((picture, i) => {
                                return (
                                    <Carousel.Item style={{ position: "relative" }}>
                                        <a href={picture} target="_blank">
                                            <img
                                                className="d-block w-100"
                                                src={picture}
                                                onClick={() => downloadBase64File(picture, i + 1)}
                                            />
                                        </a>
                                    </Carousel.Item>
                                );
                            })}

                        </Carousel>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button download = {trackingNumber + '.jpg'} href = {signature.signature} variant="success">Download</Button> */}
                        <Button variant="secondary" onClick={closeCargoPicturesModal}>Close</Button>
                    </Modal.Footer>
                </Modal>


            )}
            {signature && (
                <>
                    <Modal show={showModal}>
                        <Modal.Header>
                            <Modal.Title>Signature
                            </Modal.Title>
                            Created at: {
                                moment(signature.data.created_at).format(
                                    "Do of MMM YYYY, h:mm a"
                                )
                            }, By {signature.data.staff_username}
                        </Modal.Header>
                        <Modal.Body>
                            <img src={signature.signature} width="100%" />
                            {signature.data.note && (
                                <>
                                    <hr />
                                    <p>Note: {signature.data.note}</p>
                                </>
                            )}
                            {signature.data.lon && signature.data.lat && (
                                <>
                                    <hr />
                                    <a href={'https://maps.google.com/?q=' + signature.data.lat + ',' + signature.data.lon} target="_blank" >View location on map</a>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button download={trackingNumber + '.jpg'} href={signature.signature} variant="success">Download</Button>
                            <Button variant="secondary" onClick={closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
            <h1>Items</h1>
            <Row>
                <Col lg={3} md={6} sm={12} className="bg-white pt-4 border border-2 shadow">
                    {(stats && stats.length) && (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Q-ty</th>
                                    <th>Weight</th>
                                    <th>Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.count}</td>
                                        <td>{item.weight}</td>
                                        <td>{item.price.toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {item.ccy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    <Link className="btn btn-success my-2 mx-2 float-start" to="/manage/pickup"><i className="bi bi-plus-square me-1"></i>Pick Up</Link>
                    <Button variant={"info"} className={"float-end my-2 mx-2"} onClick={handleCsvDownload}><i className="bi bi-file-earmark-arrow-down me-1"></i> Download as CSV</Button>

                </Col>
                <Col lg={9} md={6} sm={12} className="bg-white pt-4 border border-2 shadow pb-2">
                    <Row className={"mb-3"}>
                        <Col xs={6} md={4} lg={2}>
                            <label htmlFor="paymentFilter">Payment status</label>
                            <select className={"form-control"} id="paymentFilter"
                                value={filter.PaymentStatus}
                                onChange={({ target: { value } }) => { updateFilter({ key: 'PaymentStatus', value }) }}>
                                <option value="">All</option>
                                <option value="PAID">Paid</option>
                                <option value="PENDING">Not Paid</option>
                            </select>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <label htmlFor="paymentMethodFilter">Payment method</label>
                            <select className={"form-control"} id="paymentMethodFilter"
                                value={filter.PaymentMethod}
                                onChange={({ target: { value } }) => { updateFilter({ key: 'PaymentMethod', value }) }}>
                                <option value="">All</option>
                                <option value="STRIPE">Stripe</option>
                                <option value="CASH">Cash</option>
                                <option value="BANK">Bank</option>
                                <option value="CARD">Card</option>
                            </select>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <label htmlFor="dateFrom">Date from:</label>
                            <input type={"date"} id="dateFrom" className={"form-control"} value={filter.from} onChange={({ target: { value } }) => { updateFilter({ key: 'from', value }) }} />
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <label htmlFor="dateTo">Date to:</label>
                            <input type={"date"} id="dateTo" className={"form-control"} value={filter.to} onChange={({ target: { value } }) => { updateFilter({ key: 'to', value }) }} />
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <label htmlFor="collectionOption">Collection:</label>
                            <select className={"form-control"} id="collectionOption"
                                value={filter.CollectionOption}
                                onChange={({ target: { value } }) => { updateFilter({ key: 'CollectionOption', value }) }}>
                                <option value="">All</option>
                                <option value="HOME">Home</option>
                                <option value="OFFICE">Office</option>
                            </select>
                        </Col>
                        <div className="w-100 d-none d-lg-block" />
                        <Col xs={6} md={4} lg={2}>
                            <label htmlFor="status">Status:</label>
                            <select className={"form-control"} id="status"
                                value={filter.Status}
                                onChange={({ target: { value } }) => { updateFilter({ key: 'Status', value: value }) }}>
                                <option value="">All</option>
                                <option value="PENDING">Pending</option>
                                <option value="PICKED_UP">Picked up</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="IN_TRANSIT">In transit</option>
                                <option value="ARRIVED">Arrived</option>
                                <option value="RECEIVED">Received</option>
                                <option value="DELAYED">Delayed</option>
                                <option value="RELEASED">Released</option>
                            </select>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <label htmlFor="route">Route:</label>
                            <select className={"form-control"} id="route"
                                value={`${(filter.SourceCountryCode && filter.DestinationCountryCode) ? `${filter.SourceCountryCode}/${filter.DestinationCountryCode}` : ""}`}
                                onChange={({ target: { value } }) => {
                                    const route = value ? value.split('/') : ["", ""];
                                    updateFilter({ key: 'SourceCountryCode', value: route[0] });
                                    updateFilter({ key: 'DestinationCountryCode', value: route[1] });
                                }}>
                                <option value="">All</option>
                                {routes.map((item, index) => (
                                    <option value={`${item.sourceCountryCode}/${item.destinationCountryCode}`} key={index}>{`${item.sourceCountryCode}/${item.destinationCountryCode}`}</option>
                                ))}
                            </select>
                        </Col>
                        {accountType === 'ADMIN' && accountId === "1" &&
                            <Col xs={6} md={4} lg={2}>
                                <label htmlFor="agent">Agent:</label>
                                <select className={"form-control"} id="agent"
                                    value={filter.Agent}
                                    onChange={({ target: { value } }) => { updateFilter({ key: 'Agent', value: value }) }}>
                                    <option value="">All</option>
                                    {agents && agents.map((item, index) => (
                                        <option value={item.id} key={index}>{item.username}</option>
                                    ))}
                                </select>
                            </Col>}
                        <Col xs={4}>
                            <label>&nbsp;</label>
                            <ButtonGroup className={"d-flex align-items-end"}>
                                <Button variant={"primary"} block onClick={handleFilter}>Filter</Button>
                                {(JSON.stringify(initFilterSpecs) !== JSON.stringify(filterSpecs) && JSON.stringify(initFilter) !== JSON.stringify(filter)) &&
                                    <Button variant={"danger"} onClick={resetFilter}>&times;</Button>
                                }
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={8}>
                            <input type={"text"} placeholder={"Filter through parcels"} className={"form-control"} value={searchTerm} onChange={({ target: { value } }) => { setSearchTerm(value) }} />
                        </Col>
                        <Col xs={12} md={2}>
                            <Button variant={"primary"} block onClick={handleSearch}>Search</Button>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    {/* <Button variant={"info"} className={"float-end my-2 mx-2"} onClick={handleCsvDownload}>Download as CSV</Button> */}
                    {/* <Link className={"btn btn-success float-end my-2 mx-2"} to={'/manage/pickup'}>Pick up cargo</Link> */}
                </Col>
            </Row>
            {/* <Row className={"mb-3"}>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="paymentFilter">Payment status</label>
                    <select className={"form-control"} id="paymentFilter"
                        value={filter.PaymentStatus}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'PaymentStatus', value }) }}>
                        <option value="">All</option>
                        <option value="PAID">Paid</option>
                        <option value="PENDING">Not Paid</option>
                    </select>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="paymentMethodFilter">Payment method</label>
                    <select className={"form-control"} id="paymentMethodFilter"
                        value={filter.PaymentMethod}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'PaymentMethod', value }) }}>
                        <option value="">All</option>
                        <option value="STRIPE">Stripe</option>
                        <option value="CASH">Cash</option>
                        <option value="BANK">Bank</option>
                        <option value="CARD">Card</option>
                    </select>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="dateFrom">Date from:</label>
                    <input type={"date"} id="dateFrom" className={"form-control"} value={filter.from} onChange={({ target: { value } }) => { updateFilter({ key: 'from', value }) }} />
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="dateTo">Date to:</label>
                    <input type={"date"} id="dateTo" className={"form-control"} value={filter.to} onChange={({ target: { value } }) => { updateFilter({ key: 'to', value }) }} />
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="collectionOption">Collection:</label>
                    <select className={"form-control"} id="collectionOption"
                        value={filter.CollectionOption}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'CollectionOption', value }) }}>
                        <option value="">All</option>
                        <option value="HOME">Home</option>
                        <option value="OFFICE">Office</option>
                    </select>
                </Col>
                <div className="w-100 d-none d-lg-block" />
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="status">Status:</label>
                    <select className={"form-control"} id="status"
                        value={filter.Status}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'Status', value: value }) }}>
                        <option value="">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="PICKED_UP">Picked up</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="IN_TRANSIT">In transit</option>
                        <option value="ARRIVED">Arrived</option>
                        <option value="RECEIVED">Received</option>
                        <option value="DELAYED">Delayed</option>
                        <option value="RELEASED">Released</option>
                    </select>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="route">Route:</label>
                    <select className={"form-control"} id="route"
                        value={`${(filter.SourceCountryCode && filter.DestinationCountryCode) ? `${filter.SourceCountryCode}/${filter.DestinationCountryCode}` : ""}`}
                        onChange={({ target: { value } }) => {
                            const route = value ? value.split('/') : ["", ""];
                            updateFilter({ key: 'SourceCountryCode', value: route[0] });
                            updateFilter({ key: 'DestinationCountryCode', value: route[1] });
                        }}>
                        <option value="">All</option>
                        {routes.map((item, index) => (
                            <option value={`${item.sourceCountryCode}/${item.destinationCountryCode}`} key={index}>{`${item.sourceCountryCode}/${item.destinationCountryCode}`}</option>
                        ))}
                    </select>
                </Col>
                {accountType === 'ADMIN' && accountId === "1" &&
                    <Col xs={6} md={4} lg={2}>
                        <label htmlFor="agent">Agent:</label>
                        <select className={"form-control"} id="agent"
                            value={filter.Agent}
                            onChange={({ target: { value } }) => { updateFilter({ key: 'Agent', value: value }) }}>
                            <option value="">All</option>
                            {agents && agents.map((item, index) => (
                                <option value={item.id} key={index}>{item.username}</option>
                            ))}
                        </select>
                    </Col>}
                <Col xs={4} className="ms-auto">
                    <label>&nbsp;</label>
                    <ButtonGroup className={"d-flex align-items-end"}>
                        <Button variant={"primary"} block onClick={handleFilter}>Filter</Button>
                        {(JSON.stringify(initFilterSpecs) !== JSON.stringify(filterSpecs) && JSON.stringify(initFilter) !== JSON.stringify(filter)) &&
                            <Button variant={"danger"} onClick={resetFilter}>&times;</Button>
                        }
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={10}>
                    <input type={"text"} placeholder={"Filter through parcels"} className={"form-control"} value={searchTerm} onChange={({ target: { value } }) => { setSearchTerm(value) }} />
                </Col>
                <Col xs={12} md={2}>
                    <Button variant={"primary"} block onClick={handleSearch}>Search</Button>
                </Col>
            </Row> */}
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Old View</button>
                    <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">New View</button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                    <Table responsive="md" striped bordered hover className={"items-table"}>
                        <thead>
                            <tr>
                                <th>Tracking number</th>
                                <th>Weight</th>
                                <th>From/To</th>
                                <th>Types</th>
                                <th>Description</th>
                                <th>Item price</th>
                                <th>Invoice</th>
                                <th>Notes</th>
                                <th>Price</th>
                                <th>Sender information</th>
                                <th>Receiver information</th>
                                <th>Payment info</th>
                                <th>Pictures</th>
                                <th>Signature</th>
                                <th>Customer invoices</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargos && cargos.map((cargo) => {
                                return (
                                    <tr key={cargo.tracking_number}>
                                        <td ><Link to={`/manage/item/${cargo.tracking_number}`}>{cargo.tracking_number}</Link></td>
                                        <td>{cargo.item.weight} KG</td>
                                        <td>{cargo.shipping_specs.route.source_country_code}/{cargo.shipping_specs.route.destination_country_code}</td>
                                        <td>
                                            {cargo.shipping_specs.parcel_type}<br />
                                            {cargo.shipping_specs.collection_option}<br />
                                            {cargo.customer_type}
                                        </td>
                                        <td>{cargo.item.description}</td>
                                        <td>{cargo.item.item_price} {cargo.item.item_currency_code}</td>
                                        <td>{cargo.item.invoice_path != null ? <a href={cargo.item.invoice_path}>Download</a> : <span>N/A</span>}</td>
                                        <td>{cargo.notes}
                                        </td>
                                        <td>
                                            <b>Freight:</b> {cargo.invoice.freight_price}&nbsp;{cargo.invoice.currency_code}<br />
                                            <b>Delivery:</b> {cargo.invoice.delivery_price}&nbsp;{cargo.invoice.currency_code}
                                        </td>
                                        <td>
                                            {cargo.shipping_specs.sender_information.name}<br />
                                            {cargo.shipping_specs.sender_information.email}<br />
                                            {cargo.shipping_specs.sender_information.phone}<br />
                                            {cargo.shipping_specs.sender_information.address.address_line_1}<br />
                                            {cargo.shipping_specs.sender_information.address.address_line_2}<br />
                                            {cargo.shipping_specs.sender_information.address.postal_code}<br />
                                            {cargo.shipping_specs.sender_information.address.country_code}<br />
                                        </td>
                                        <td>
                                            {cargo.shipping_specs.receiver_information.name}<br />
                                            {cargo.shipping_specs.receiver_information.email}<br />
                                            {cargo.shipping_specs.receiver_information.phone}<br />
                                            {cargo.shipping_specs.receiver_information.address.address_line_1}<br />
                                            {cargo.shipping_specs.receiver_information.address.address_line_2}<br />
                                            {cargo.shipping_specs.receiver_information.address.postal_code}<br />
                                            {cargo.shipping_specs.receiver_information.address.country_code}<br />
                                        </td>
                                        <td>
                                            <b>Invoice Id:</b> {cargo.invoice.invoice_id}<br />
                                            <b>Status:</b>
                                            {cargo.invoice.payment_status === 'PAID' ? (
                                                <div className="alert bg-success text-white p-1 d-inline-block">Paid</div>
                                            ) : (
                                                <div className="alert bg-danger text-white p-1 d-inline-block">Unpaid</div>
                                            )}
                                            <br />
                                            <b>Code:</b> {cargo.release_code}
                                            <b>Stripe payment link:</b> <a href={process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.invoice.invoice_id}>Pay</a> &nbsp;
                                            <a role="button" target="_blank" className="text-primary" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.invoice.invoice_id), toast.success("Copied to clipboard!", toastOptions))}><i className="bi bi-subtract"></i></a>

                                            {cargo.checkout.length > 1 && (
                                                <>
                                                    <br />
                                                    <b className="text-danger">Stripe checkout items link:</b> <a href={process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.checkout.join(',')}>Pay</a>
                                                    &nbsp;
                                                    <a role="button" target="_blank" className="text-primary" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.checkout.join(',')), toast.success("Copied to clipboard!", toastOptions))}><i className="bi bi-subtract"></i></a>
                                                </>
                                            )}
                                        </td>
                                        <td>{cargo.pictures == 1 && (
                                            <span className="btn btn-link" onClick={() => getPicturesHandler(cargo.tracking_number)}>
                                                View pictures &nbsp;
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
                                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                                                </svg>
                                            </span>
                                        )}
                                            {cargo.pictures == 0 && (
                                                "Pictures not found."
                                            )}
                                        </td>
                                        <td>{cargo.signature == 1 && (
                                            <span className="btn btn-link" onClick={() => getSignatureHandler(cargo.tracking_number)}>
                                                View signature &nbsp;
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-vector-pen" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828L10.646.646zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z" />
                                                    <path fillRule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086.086-.026z" />
                                                </svg>
                                            </span>
                                        )}
                                            {cargo.signature == 0 && (
                                                "Signature not found."
                                            )}
                                        </td>
                                        <td>
                                            <ul>
                                                {cargo.customer_invoices.map((item, i) =>
                                                    <>
                                                        {(i + 1) + ". "}
                                                        <li key={i} className="d-inline-block w-full"><a type="button" className="btn-link text-primary" onClick={() => openInNewTab(process.env.REACT_APP_API + '/customer/invoice?file=' + item)} target="_blank">{item}</a>&nbsp;
                                                            <i role="button" className="bi bi-trash3 text-danger pl-2" onClick={() => deleteCustomerInvoice(item)}></i>
                                                        </li>
                                                        <br />
                                                    </>
                                                )
                                                }
                                            </ul>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table >
                </div>
                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                    <div className="table-responsive">
                        <table className="table table-light table-hover">
                            <thead>
                                <tr>
                                    {/* <th scope="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                        </div>
                                    </th> */}
                                    <th scope="col"># Tracking</th>
                                    <th scope="col">Route</th>
                                    <th scope="col">Sender</th>
                                    <th scope="col">Receiver</th>
                                    <th scope="col">Invoice</th>
                                    <th scope="col">Collection/Status</th>
                                    <th scope="col">Weight</th>
                                    <th scope="col">Notes</th>
                                    <th scope="col">Links</th>
                                    <th scope="col">Date</th>
                                    {/* <th scope="col">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {cargos && cargos.map((cargo, i) => (
                                    <tr key={i}>
                                        {/* <th>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />

                                            </div>
                                        </th> */}
                                        <th className="p-1" scope="row" style={{ backgroundColor: cargo.color }}><Link to={`/manage/item/${cargo.tracking_number}`} style={{ color: 'white' }}>{cargo.tracking_number}</Link></th>
                                        <td className="p-1">{flagEmoji(cargo.shipping_specs.route.source_country_code)}{' -> '}{flagEmoji(cargo.shipping_specs.route.destination_country_code)}</td>
                                        <td className="p-0"

                                        >
                                            <Link to={`/manage/client/${btoa(cargo.shipping_specs.sender_information.email)}`}>{cargo.shipping_specs.sender_information.name}</Link>
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
                                                                    Name: <b>{cargo.shipping_specs.sender_information.name}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Email: <b>{cargo.shipping_specs.sender_information.email}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    phone: <b>{cargo.shipping_specs.sender_information.phone}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Country code: <b>{cargo.shipping_specs.sender_information.address.country_code}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 1: <b>{cargo.shipping_specs.sender_information.address.address_line_1}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 2: <b>{cargo.shipping_specs.sender_information.address.address_line_2}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Postal code: <b>{cargo.shipping_specs.sender_information.address.postal_code}</b>
                                                                </li>
                                                            </ul>
                                                        </Popover.Content>
                                                    </Popover>
                                                )}>
                                                <small className="btn btn-link text-dark ms-1 p-0" >
                                                    <i className="bi bi-info-square"></i>
                                                </small>
                                            </OverlayTrigger>
                                            {cargo.book_before_cargo !== '' && (
                                                <div className="badge bg-success ms-1">{cargo.book_before_cargo}</div>
                                            )}
                                        </td>
                                        <td className="p-1">
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
                                                                    Name: <b>{cargo.shipping_specs.receiver_information.name}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Email: <b>{cargo.shipping_specs.receiver_information.email}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    phone: <b>{cargo.shipping_specs.receiver_information.phone}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Country code: <b>{cargo.shipping_specs.receiver_information.address.country_code}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 1: <b>{cargo.shipping_specs.receiver_information.address.address_line_1}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Address Line 2: <b>{cargo.shipping_specs.receiver_information.address.address_line_2}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Postal code: <b>{cargo.shipping_specs.receiver_information.address.postal_code}</b>
                                                                </li>
                                                            </ul>
                                                        </Popover.Content>
                                                    </Popover>
                                                )}>
                                                <small className="btn btn-link p-0 ps-1" style={{ fontSize: "13px" }}>
                                                    {cargo.shipping_specs.receiver_information.name}
                                                </small>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="p-1">
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
                                                                    Weight: <b>{cargo.item.weight.toFixed(2)}kg</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Freight Price: <b>{currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.freight_price.toFixed(2)}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Delivery Price: <b>{currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.delivery_price.toFixed(2)}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Packaging Price: <b>{currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.packaging_price.toFixed(2)}</b>
                                                                </li>

                                                                <li style={{ fontSize: "13px" }}>
                                                                    Discount: <b>{currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.discount_amount.toFixed(2)}</b>
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    {cargo.invoice.extra_charges.length > 0 && (
                                                                        <div>
                                                                            Extra Charges: <b>{cargo.invoice.extra_charges.map((ex, i) => (
                                                                                <span className="badge text-bg-primary">{ex.note}: {currency_symbols(cargo.invoice.currency_code)}{ex.amount.toFixed(2)}</span>
                                                                            ))}</b>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                                <li style={{ fontSize: "13px" }}>
                                                                    Total Amount: <b>{currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.total_amount.toFixed(2)}</b>
                                                                </li>

                                                            </ul>
                                                        </Popover.Content>
                                                    </Popover>
                                                )}>
                                                <div role="button">
                                                    {cargo.invoice.payment_status === 'PAID' ?
                                                        (
                                                            <div style={{ fontSize: "12px" }} className="badge bg-success me-1">Paid {currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.total_amount.toFixed(2)}</div>
                                                        )
                                                        : (
                                                            <div style={{ fontSize: "12px" }} className="badge bg-danger me-1">Unpaid {currency_symbols(cargo.invoice.currency_code)}{cargo.invoice.total_amount.toFixed(2)}</div>
                                                        )}
                                                    <div style={{ fontSize: "12px" }} className="badge bg-primary me-1">{cargo.payment_method}</div>
                                                </div>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="p-1">
                                            {cargo.shipping_specs.collection_option === 'HOME' ? (
                                                <div style={{ fontSize: "12px" }} className="badge bg-primary me-1">Home</div>

                                            ) : (
                                                <div style={{ fontSize: "12px" }} className="badge bg-success me-1">Office</div>
                                            )}
                                            {cargo.events && cargo.events.length > 0 ? (

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
                                                                        {cargo.events.map((ev, i) => (
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
                                                    <div role="button" style={{ fontSize: "12px" }} className="badge bg-dark me-1">{cargo.status}</div>
                                                </OverlayTrigger>
                                            ) : (
                                                <div role="button" style={{ fontSize: "12px" }} className="badge bg-dark me-1">{cargo.status}</div>
                                            )}


                                        </td>
                                        <td className="p-1">
                                            <b>{cargo.item.weight.toFixed(2)} kg</b>
                                        </td>
                                        <td className="p-1">
                                            {cargo.notes === '' ? (
                                                <div
                                                    role="button"
                                                    onClick={() => openNotesModalModal({ tracking: cargo.tracking_number, staff: cargo.staff, notes: cargo.web_notes.concat(cargo.book_notes) })}
                                                    style={{ fontSize: "13px" }} className={"badge me-1 bg-warning text-dark " + (cargo.web_notes.concat(cargo.book_notes).filter(mp => mp.body.includes('@[' + auth.staff.username + ']')).length > 0 && cargo.web_notes[0]?.seen === 0 ? 'shake ' : '')}>Notes({(cargo.web_notes.concat(cargo.book_notes)?.length + (cargo.notes === '' ? 0 : 1)) > 9 ? '9+' : cargo.web_notes.concat(cargo.book_notes)?.length + (cargo.notes === '' ? 0 : 1)})</div>
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
                                                                {cargo.notes}
                                                            </Popover.Content>
                                                        </Popover>
                                                    )}>
                                                    <div
                                                        role="button"
                                                        onClick={() => openNotesModalModal({ tracking: cargo.tracking_number, staff: cargo.staff, notes: cargo.web_notes.concat(cargo.book_notes) })}
                                                        style={{ fontSize: "13px" }} className={"badge me-1 bg-warning text-dark " + (cargo.web_notes.concat(cargo.book_notes).filter(mp => mp.body.includes('@[' + auth.staff.username + ']')).length > 0 && cargo.web_notes[0]?.seen === 0 ? 'shake ' : '')}>Notes({(cargo.web_notes.concat(cargo.book_notes)?.length + (cargo.notes === '' ? 0 : 1)) > 9 ? '9+' : cargo.web_notes.concat(cargo.book_notes)?.length + (cargo.notes === '' ? 0 : 1)})</div>
                                                </OverlayTrigger>
                                            )}
                                        </td>
                                        <td className="p-1">
                                            <a role="button" target="_blank" className="text-primary" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.invoice.invoice_id), toast.success("Copied to clipboard!", toastOptions))}>Stripe Link <i className="bi bi-subtract"></i></a>
                                            {cargo.checkout.length > 1 && (
                                                <>
                                                    <br />
                                                    <a role="button" target="_blank" className="text-danger" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + cargo.checkout.join(',')), toast.success("Copied to clipboard!", toastOptions))}>Checkout Link <i className="bi bi-subtract"></i></a>
                                                </>
                                            )}
                                        </td>
                                        <td className="p-1">
                                            <OverlayTrigger
                                                placement="auto"
                                                trigger={["focus", "hover"]}
                                                overlay={(
                                                    <Popover>
                                                        <Popover.Title as="h6">
                                                            Time
                                                        </Popover.Title>
                                                        <Popover.Content>
                                                            {moment(cargo.created_at).format(
                                                                "D MMMM, YYYY, h:mm:ss a"
                                                            )}
                                                        </Popover.Content>
                                                    </Popover>
                                                )}>
                                                <div role="button">
                                                    {moment(cargo.created_at).fromNow()}
                                                </div>
                                            </OverlayTrigger>

                                        </td>
                                        {/* <td>
                                            <div className="dropdown">
                                                <a className="btn btn-light btn-xs dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Actions
                                                </a>

                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                                </ul>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Row>
                <Col>
                    <Button variant={"light"} onClick={() => {
                        setPagingSpecs({ ...pagingSpecs, page_offset: pagingSpecs.page_offset - pagingSpecs.page_size });
                    }} block disabled={pagingSpecs.page_offset === 0}> Previous </Button>
                </Col>
                <Col>
                    <Button variant={"light"} onClick={() => {
                        setPagingSpecs({ ...pagingSpecs, page_offset: pagingSpecs.page_offset + pagingSpecs.page_size });
                    }} block> Next </Button>
                </Col>
            </Row>

            {activeNotes && (
                <BookNotesModal
                    activeNotes={activeNotes}
                    closeNotesModalModal={closeNotesModalModal}
                    showNotesModal={showNotesModal}
                    openNotesModalModal={openNotesModalModal}
                    auth={auth}
                    setActiveNotes={setActiveNotes}
                    books={cargos}
                    setBooks={setCargos}
                    canAddNote={true}
                />
            )}
        </>
    );
}

export default ItemsTable;
