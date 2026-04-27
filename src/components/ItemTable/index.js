import { useParams, Link } from 'react-router-dom';
import getItemReq from "requests/getItem";
import { useRequest } from 'hooks';
import { useContext, useEffect, useState } from 'react';
import { currency_symbols } from 'utils/Currency';
import { flagEmoji } from 'utils/FlagEmoji';
import moment from "moment";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import copy from 'copy-to-clipboard';
import { toast } from "react-toastify";
import PayParcels from "requests/PayParcels";
import { editContactInformation } from 'requests/eidtContactInformation';
import { Modal } from "react-bootstrap";
import countryListAllIsoData from "utils/CountryList";
import { AuthContext } from 'context';
import getCustomerAddressSuggestions from "requests/getCustomerAddressSuggestions";
import { useForm } from "react-hook-form";
import CargoAddNoteModal from 'components/CargoAddNoteModal';
// import deleteCargoNote from "requests/deleteCargoNote";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

function ItemTable() {
    // const [deleteCargoNoteReq] = useRequest(deleteCargoNote);
    const { auth: { routes, staff, accountType, accountId } } = useContext(AuthContext);
    const { auth } = useContext(AuthContext);
    const isAdmin = auth.accountType === "ADMIN" && auth.accountId === "1";
    const isSubAdmin = auth.staff.privileges.includes('SUB_ADMIN');
    const amendCargoInformation = auth.staff.privileges.includes('EDIT_CONTACT_INFORMATION');
    const amendCargoNotes = auth.staff.privileges.includes('EDIT_BOOKING_NOTES');

    const { setValue, trigger, handleSubmit, register, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
    const [senderSuggestions, setSenderSuggestions] = useState([]);
    const params = useParams()
    const [customerSuggestion] = useRequest(getCustomerAddressSuggestions);
    const [editContactInformationReq] = useRequest(editContactInformation);
    const [getItem] = useRequest(getItemReq);
    const [data, setData] = useState(null);
    const [sendingStripeLink, setSendingStripeLink] = useState(false);
    const [showCargoNoteModal, setShowCargoNoteModal] = useState(false);
    const [sendingStripeLinkAll, setSendingStripeLinkAll] = useState(false);
    const [payPrcls] = useRequest(PayParcels);
    const [updatingAddress, setUpdatingAddress] = useState(false);
    const [toUpdate, setToUpdate] = useState({
        id: params.id,
        address: null,
        update_all: 0,
        target: null,
    });
    useEffect(() => {
        getItem({ tracking: params.id })
            .then((response) => {
                if (response?.data === undefined) {
                    window.location.href = '/not-found'
                }
                console.log(response);
                setData(response.data.cargo);
            });
    }, [params.id]);

    useEffect(() => {
    }, [toUpdate]);

    const handleUpdateTrgt = (e, key) => {
        setToUpdate({
            ...toUpdate, address:
                { ...toUpdate.address, [e.target.name]: e.target.value }
        });
    };

    const updateAddress = () => {
        editContactInformationReq(toUpdate)
            .then((response) => {
                if (!response.data.error) {
                    toast.success('Address updated!', toastOptions);
                    setToUpdate({ address: null, target: null, update_all: 0 });
                    setData({ ...data, [toUpdate?.target]: toUpdate.address });
                }
            }).catch(error => {
                console.log(error);
            });
    };

    const sendStripeCheckoutLinkAll = () => {
        setSendingStripeLinkAll(true);
        let ids = data.checkouts.map(i => i.invoice_id);
        payPrcls({ invoice_ids: ids, payment_method: 'ONLINE' })
            .then((response) => {
                setSendingStripeLinkAll(false);
                toast.success("Sent!", toastOptions)
            });
    };

    const sendStripeCheckoutLink = () => {
        setSendingStripeLink(true);
        let ids = [data.invoice.id];
        payPrcls({ invoice_ids: ids, payment_method: 'ONLINE' })
            .then((response) => {
                setSendingStripeLink(false);
                console.log(response);
                toast.success("Sent!", toastOptions)
            });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (toUpdate?.address?.name !== null) {
                customerSuggestion({ name: toUpdate?.address?.name })
                    .then((response) => {
                        setSenderSuggestions(response.data.customers);
                    })
                    .catch((e) => console.error(e, 999));
            }
        }, 1500);
        return () => clearTimeout(delayDebounceFn)

    }, [toUpdate?.address?.name]);

    const TrgtFromSuggestion = (sug) => {
        setToUpdate({
            ...toUpdate, address:
                { ...toUpdate.address, name: sug.name, email: sug.email, phone: sug.phone, id: sug.id, address_line_1: sug.address.address_line_1, address_line_2: sug.address.address_line_2, address_country_code: sug.address.country_code, postal_code: sug.address.postal_code }
        });
        setSenderSuggestions([]);
    };

    return (
        <>
            {data && (

                <div className="row">
                    <div className="col-12 col-xl-6 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom p-3">
                                <div className="d-block">
                                    <h2 className="h3 fw-extrabold">Cargo Information</h2>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className='row'>
                                    <div className='col-12'>
                                        <div class="table-responsive">
                                            <table className="table mb-0 table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <th className="p-0" scope="row">Tracking Number</th>
                                                        <td className="p-0"><b>{data.tracking_number}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Item Id</th>
                                                        <td className="p-0"><b>{data.item.id}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Item Weight</th>
                                                        <td className="p-0"><b>{data.item.weight}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Item Description</th>
                                                        <td className="p-0"><b>{data.item.description}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Item Currency</th>
                                                        <td className="p-0"><b>{data.item.currency}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Source Country</th>
                                                        <td className="p-0"><b>{data.source_country_code} {flagEmoji(data.source_country_code)}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Destination Country</th>
                                                        <td className="p-0"><b>{data.destination_country_code} {flagEmoji(data.destination_country_code)}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Parcel Type</th>
                                                        <td className="p-0"><b>{data.type}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Collection Option</th>
                                                        <td className="p-0"><b>{data.collection_option}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Cutomer Type</th>
                                                        <td className="p-0"><b>{data.customer_type}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Payment Status</th>
                                                        <td className="p-0"><b>{data.payment_status === 'PENDING' ? (
                                                            <span className="badge text-bg-warning">Pending</span>
                                                        ) : (
                                                            <span className="badge text-bg-success">Paid</span>
                                                        )}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Status</th>
                                                        <td className="p-0"><b>{data.status}</b></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {data.checkouts.length > 1 && (
                                <div className='card-footer border border-1'>
                                    <small className='text-dark'><i className="bi bi-info-circle"></i> Items checkout out with current item</small>
                                    <br className='mb-4 d-block' />
                                    <br />
                                    {data.checkouts.filter(c => c.invoice_id !== data.invoice.id).map((ci, i) => (
                                        <div key={i} className='shadow-sm d-inline-block me-2 mb-2 bg-light text-dark p-2 rounded border border-1'>
                                            <Link to={`/manage/item/${ci.tracking_number}`}>{ci.tracking_number}</Link> {ci.payment_status === 'PENDING' ? (
                                                <span className="badge text-bg-warning">Pending</span>
                                            ) : (
                                                <span className="badge text-bg-success">Paid</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-12 col-xl-6 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom p-3">
                                <div className="d-block">
                                    <h2 className="h3 fw-extrabold">Invoice</h2>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className='row'>
                                    <div className='col-12'>
                                        <div class="table-responsive">
                                            <table className="table mb-0 table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <th className="p-0" scope="row">Id</th>
                                                        <td className="p-0"><b>{data.invoice.id}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Currency</th>
                                                        <td className="p-0"><b>{data.invoice.currency_code}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Packaging Price</th>
                                                        <td className="p-0"><b>{currency_symbols(data.invoice.currency_code)}{data.invoice.packaging_price.toFixed(2)}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Freight Price</th>
                                                        <td className="p-0"><b>{currency_symbols(data.invoice.currency_code)}{data.invoice.freight_price.toFixed(2)}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Delivery Price</th>
                                                        <td className="p-0"><b>{currency_symbols(data.invoice.currency_code)}{data.invoice.delivery_price.toFixed(2)}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Discount</th>
                                                        <td className="p-0"><b>{currency_symbols(data.invoice.currency_code)}{data.invoice.discount.toFixed(2)}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Extra Charges</th>
                                                        <td className="p-0">{JSON.parse(data.invoice.extra_charges).length > 0 ? JSON.parse(data.invoice.extra_charges).map((ec) => (
                                                            <span className="badge text-bg-primary ms-1">{ec.note}: {currency_symbols(data.invoice.currency_code)}{ec.amount}</span>
                                                        )) : (<b>None</b>)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Total</th>
                                                        <td className="p-0"><b>{currency_symbols(data.invoice.currency_code)}{(data.invoice.packaging_price + data.invoice.freight_price + data.invoice.delivery_price + JSON.parse(data.invoice.extra_charges).reduce((n, { amount }) => n + amount, 0) - data.invoice.discount).toFixed(2)}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Payment Link</th>
                                                        <td className="p-0"><b><b><a target="_blank" href={process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + data.invoice.id}>Link</a></b>
                                                            {" "}<a role="button" target="_blank" className="text-primary" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + data.invoice.id), toast.success("Copied to clipboard!", toastOptions))}><i className="bi bi-subtract"></i></a></b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Checkout Payment Link</th>
                                                        <td className="p-0">
                                                            {data.checkouts.length > 1 && (
                                                                <b>
                                                                    <a className="text-danger" href={process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + data.checkouts.map(c => c.invoice_id).join(',')}>Link</a>
                                                                    &nbsp;
                                                                    <a className="text-danger" role="button" target="_blank" onClick={() => (copy(process.env.REACT_APP_API + "/billing/payment/stripe?invoice_ids=" + data.checkouts.map(c => c.invoice_id).join(',')), toast.success("Copied to clipboard!", toastOptions))}><i className="bi bi-subtract"></i></a>
                                                                </b>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {data.payment_status === 'PENDING' && (
                                <div className='card-footer border border-1 border-warning bg-warning'>
                                    <small className='text-dark'><i className="bi bi-info-circle"></i> In case Customer did not received email, try to send it again.</small>
                                    <br className='mb-4 d-block' />
                                    <br />
                                    <button
                                        onClick={() => sendStripeCheckoutLink()}
                                        disabled={sendingStripeLink}
                                        className='btn-sm p-2 btn btn-outline-dark me-2'><i className="bi bi-envelope"></i> Send Payment Link</button>
                                    <button
                                        disabled={sendingStripeLinkAll}
                                        onClick={() => sendStripeCheckoutLinkAll()}
                                        className='btn-sm p-2 btn btn-outline-dark me-2'><i className="bi bi-envelope"></i> Send Checkout Payment Link</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-12 col-xl-6 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom p-3">
                                <div className="d-block w-100">
                                    <h2 className="d-inline-block float-start h3 fw-extrabold">Sender {flagEmoji(data.source_country_code)}</h2>
                                    {(isAdmin || isSubAdmin || amendCargoInformation) && (
                                        <button
                                            onClick={() => setToUpdate({ ...toUpdate, address: data.sender, target: 'sender' })}
                                            className='float-end btn btn-outline-info'>Edit</button>
                                    )}
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className='row'>
                                    <div className='col-12'>
                                        <div class="table-responsive">
                                            <table className="table mb-0 table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <th className="p-0" scope="row">Name</th>
                                                        <td className="p-0"><b>{data.customer.id === undefined ? (
                                                            data.sender.name
                                                        ) : (

                                                            <Link to={`/manage/client/${btoa(data.sender.email)}`}>{data.sender.name}</Link>
                                                        )}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Email</th>
                                                        <td className="p-0"><b>{data.sender.email}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Phone</th>
                                                        <td className="p-0"><b>{data.sender.phone}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Country Code</th>
                                                        <td className="p-0"><b>{data.sender.address_country_code}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Line 1</th>
                                                        <td className="p-0"><b>{data.sender.address_line_1}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Line 2</th>
                                                        <td className="p-0"><b>{data.sender.address_line_2 || '-'}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Postal Code</th>
                                                        <td className="p-0"><b>{data.sender.postal_code}</b></td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-6 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom p-3">
                                <div className="d-block w-100">
                                    <h2 className="d-inline-block float-start h3 fw-extrabold">Receiver {flagEmoji(data.destination_country_code)}</h2>
                                    {(isAdmin || isSubAdmin || amendCargoInformation) && (
                                        <button
                                            onClick={() => setToUpdate({ ...toUpdate, address: data.receiver, target: 'receiver' })}
                                            className='float-end btn btn-outline-info'>Edit</button>
                                    )}
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className='row'>
                                    <div className='col-12'>
                                        <div class="table-responsive">
                                            <table className="table mb-0 table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <th className="p-0" scope="row">Name</th>
                                                        <td className="p-0"><b>{data.receiver.name}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Email</th>
                                                        <td className="p-0"><b>{data.receiver.email}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Phone</th>
                                                        <td className="p-0"><b>{data.receiver.phone}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Country Code</th>
                                                        <td className="p-0"><b>{data.receiver.address_country_code}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Line 1</th>
                                                        <td className="p-0"><b>{data.receiver.address_line_1}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Line 2</th>
                                                        <td className="p-0"><b>{data.receiver.address_line_2 || '-'}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="p-0" scope="row">Postal Code</th>
                                                        <td className="p-0"><b>{data.receiver.postal_code}</b></td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-6 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom p-3">
                                <div className="d-block">
                                    <h2 className="h3 fw-extrabold">Events</h2>
                                </div>
                            </div>
                            <div className="card-body p-4">

                                {data.events.map((ev, i) => (
                                    <div key={i} className='shadow-sm d-inline-block me-2 mb-2 bg-light text-dark p-2 rounded border border-1'><Link to={`/manage/agent/${ev.handler_staff_id}`}><b>{ev.username}</b></Link> <i className="bi bi-arrow-right-short"></i>
                                        {ev.type}
                                        {' ('}{moment(ev.created_at).fromNow()}
                                        <OverlayTrigger
                                            placement="auto"
                                            trigger={["focus", "hover"]}
                                            overlay={(
                                                <Popover>
                                                    <Popover.Title>
                                                        Time
                                                    </Popover.Title>
                                                    <Popover.Content>
                                                        <p>{ev.created_at}</p>
                                                    </Popover.Content>
                                                </Popover>
                                            )}>
                                            <small className="text-dark fw-semibold">{' '}<i className="bi bi-info-circle"></i>{')'}</small>

                                        </OverlayTrigger>
                                    </div>
                                ))}

                                {data.events.length < 1 && (
                                    <div className="alert alert-warning d-inline-block">No events yet</div>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-6 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom p-3">
                                <div className="d-block w-100">
                                    <h2 className="d-inline-block float-start h3 fw-extrabold">Notes</h2>
                                    {(isAdmin || isSubAdmin || amendCargoNotes) && (
                                        <button
                                            onClick={() => setShowCargoNoteModal(true)}
                                            className='float-end btn btn-outline-success'>Add</button>
                                    )}
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <p>{data.notes === '' ? (
                                    <div className="alert alert-warning d-inline-block">App notes not found</div>
                                ) : (
                                    data.notes
                                )}</p>
                                {/* <hr />
                                {data.web_notes.length > 0 && data.web_notes.map(nt => (
                                    <div className="d-flex justify-content-between align-items-center">

                                        <div className="user d-flex flex-row align-items-center">

                                            <span><small className="font-weight-bold text-primary">{nt.username}</small>
                                                <small style={{ fontSize: "12px" }} className="text-muted"> -
                                                    {
                                                        moment(nt.created_at).format(
                                                            "D MMMM, YYYY - HH:mm"
                                                        )
                                                    }
                                                </small>
                                                <div className="clearfix" />
                                                <p className="font-weight-bold mb-0">{nt.body}</p>
                                            </span>

                                        </div>


                                        {(parseInt(auth.staff.id) === 1 || parseInt(auth.staff.id) === parseInt(nt.staff_id)) && (
                                            <div style={{ fontSize: "12px" }}>
                                                <div className="reply" style={{ minWidth: "35px" }}>
                                                    <i
                                                        onClick={() => handleDeleteNote(nt)}
                                                        role="button" className="bi bi-trash me-1 text-danger"></i>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                ))} */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toUpdate.address && (
                <Modal
                    size="lg"
                    onHide={() => setToUpdate({ address: null, target: null, update_all: 0 })}
                    show={toUpdate.address !== null}
                    fullscreen={true}
                    aria-labelledby="create-route-title"
                    backdrop="static"
                >
                    {/* <Modal.Header  /> */}
                    <Modal.Header closeButton>
                        <h3>Edit {toUpdate.target}</h3>
                    </Modal.Header>
                    <Modal.Body className="pt-0">
                        <>
                            <div className="form-floating mb-1">
                                <input
                                    value={toUpdate.address.name}
                                    {...register("name", {
                                        required: {
                                            value: true,
                                            message: "This field is required"
                                        },
                                    })}
                                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                                    type="text" name="name" className="form-control position-relative" id="floatingInput" placeholder="" />
                                <label for="floatingInput">Sender Name</label>
                                {errors.name && <p className="text-danger d-block w-full">{errors.name?.message}</p>}
                                {senderSuggestions && senderSuggestions.length > 0 && (
                                    <div className=''>
                                        <a role="button" className='d-inline-block text-white bg-danger list-group-item list-group-item-action p-2 text-center' onClick={() => setSenderSuggestions([])}>Clear</a>
                                    </div>
                                )}
                                {senderSuggestions && senderSuggestions.length > 0 && toUpdate.address.name !== null && (
                                    <div className="list-group w-100 shadow-md position-absolute overflow-scroll" style={{ zIndex: 5, height: "400px" }}>
                                        {senderSuggestions.map((suggestion, i) => (
                                            <a role="button" key={i}
                                                onClick={() => TrgtFromSuggestion(suggestion, 'sender')}
                                                className="list-group-item list-group-item-action d-flex p-3" aria-current="true">
                                                <div className="d-flex gap-2 w-100 justify-content-between">
                                                    <div>
                                                        <h6 className="mb-0">{suggestion.name}</h6>
                                                    </div>
                                                    <small className="opacity-50 text-nowrap">{suggestion.address.country_code}</small>
                                                </div>
                                            </a>
                                        ))}


                                    </div>
                                )}
                            </div>
                            <div className="form-floating mb-1">
                                <input
                                    value={toUpdate.address.phone}
                                    {...register("phone", {
                                        required: {
                                            value: true,
                                            message: "This field is required"
                                        },
                                    })}
                                    onChange={(e) => handleUpdateTrgt(e, toUpdate.target)}
                                    type="text" name="phone" className="form-control" id="floatingInput" placeholder="" />
                                <label for="floatingInput">Sender Phone</label>
                                {errors.phone && <p className="text-danger d-block w-full">{errors.phone?.message}</p>}
                            </div>
                            <div className="form-floating mb-1">
                                <input
                                    value={toUpdate.address.email}
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message: "This field is required"
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "invalid email address"
                                        }
                                    })}
                                    onChange={(e) => handleUpdateTrgt(e, toUpdate.target)}
                                    type="email" name="email" className="form-control" id="floatingInput" placeholder="" />
                                <label for="floatingInput">Sender Email</label>
                                {errors.email && <p className="text-danger d-block w-full">{errors.email.message}</p>}
                            </div>
                            <div className="form-floating mb-1">
                                <input
                                    value={toUpdate.address.address_line_1}
                                    {...register("address_line_1", {
                                        required: {
                                            value: true,
                                            message: "This field is required"
                                        },
                                    })}
                                    onChange={(e) => handleUpdateTrgt(e, toUpdate.target)}
                                    type="text" name="address_line_1" className="form-control" id="floatingInput" placeholder="" />
                                <label for="floatingInput">Sender Address line 1</label>
                                {errors.address_line_1 && <p className="text-danger d-block w-full">{errors.address_line_1.message}</p>}

                            </div>
                            <div className="form-floating mb-1">
                                <input
                                    value={toUpdate.address.address_line_2}
                                    {...register("address_line_2", {
                                        required: {
                                            value: false,
                                            message: "This field is required"
                                        },
                                    })}
                                    onChange={(e) => handleUpdateTrgt(e, toUpdate.target)}
                                    type="text" name="address_line_2" className="form-control" id="floatingInput" placeholder="" />
                                <label for="floatingInput">Sender Address line 2</label>
                                {errors.address_line_2 && <p className="text-danger d-block w-full">{errors.address_line_2.message}</p>}

                            </div>
                            <div className="form-floating mb-1">
                                <input
                                    value={toUpdate.address.postal_code}
                                    {...register("postal_code", {
                                        required: {
                                            value: true,
                                            message: "This field is required"
                                        },
                                    })}
                                    onChange={(e) => handleUpdateTrgt(e, toUpdate.target)}
                                    type="text" name="postal_code" className="form-control" id="floatingInput" placeholder="" />
                                <label for="floatingInput">Sender postal code</label>
                                {errors.postal_code && <p className="text-danger d-block w-full">{errors.postal_code.message}</p>}
                            </div>
                            <div className="form-floating mb-1">
                                <select
                                    value={toUpdate.address.country_code}
                                    {...register("country_code", {
                                        required: {
                                            value: true,
                                            message: "This field is required"
                                        },
                                    })}
                                    onChange={(e) => handleUpdateTrgt(e, toUpdate.target)}
                                    type="text" name="country_code" className="form-control" id="floatingInput" placeholder="">
                                    {console.log(routes)}
                                    {routes && [...new Map(routes.map(v => [v.sourceCountryCode, v])).values()].map((route, i) => (
                                        <option key={i} value={route.sourceCountryCode}>{countryListAllIsoData.find(item => item.value === route.sourceCountryCode).label}</option>
                                    ))}
                                </select>
                                <label for="floatingInput">Sender address country code</label>
                                {errors.country_code && <p className="text-danger d-block w-full">{errors.country_code.message}</p>}
                            </div>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox"
                                    checked={toUpdate.update_all === 1}
                                    onClick={() => setToUpdate({ ...toUpdate, update_all: toUpdate.update_all === 1 ? 0 : 1 })}
                                    id="flexCheckDefault" />
                                <label className="form-check-label" for="flexCheckDefault">
                                    Update for all parcels with this address
                                </label>
                            </div>
                            <div className="form-floating mb-1">
                                <button className='btn btn-primary float-end'
                                    onClick={handleSubmit(updateAddress)}
                                    disabled={updatingAddress}>
                                    {updatingAddress ? (
                                        "Updating..."
                                    ) : (
                                        "Update"
                                    )}</button>
                            </div>
                        </>
                    </Modal.Body>
                </Modal>
            )}
            {data && (
                <CargoAddNoteModal
                    id={data.tracking_number}
                    show={showCargoNoteModal}
                    setShow={setShowCargoNoteModal}
                    setData={setData}
                    data={data}
                />
            )}
        </>
    );
}

export default ItemTable;