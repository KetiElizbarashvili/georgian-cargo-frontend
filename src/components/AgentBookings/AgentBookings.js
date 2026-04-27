import React, { useState, useRef, useEffect, useContext, Fragment } from "react";
import agentGetBookings from "requests/agentGetBookings";
import agentGetAllBookings from "requests/agentGetAllBookings";
import { useRequest } from "hooks";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import { flagEmoji } from "../../utils/FlagEmoji";
import { Modal, Col, Row, Button } from "react-bootstrap";
import { AuthContext } from "../../context";
import { DiVim } from "react-icons/di";
import BookDetails from "components/ClientBookings/BookDetails";
import { useForm } from "react-hook-form";
import agetProceedBookings from "requests/agentProceedBookings";
import agentDeleteBookings from "requests/agentDeleteBookings"
import { toast } from "react-toastify";
import { CSVLink, CSVDownload } from "react-csv";
import BookNotesModal from "components/BookNotesModal";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};


function AgentBookings() {
  const { auth } = useContext(AuthContext);
  const [getBookingsForAgentReq] = useRequest(agentGetBookings);
  const [getAllBookingsForAgentReq] = useRequest(agentGetAllBookings);
  const [agetProceedBookingsReq] = useRequest(agetProceedBookings);
  const [agetDeleteBookingsReq] = useRequest(agentDeleteBookings);
  const [books, setBooks] = useState(null);
  const [csvBooks, setCsvBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [updatingNote, setUpdatingNote] = useState(null);
  const [loadingCsvData, setLoadingCsvData] = useState(false);
  const [itemsToProceed, setItemsToProceed] = useState([]);
  const [showHandleBookingForm, setShowHandleBookingForm] = useState(false);
  const [bookingStatusUpdatingStatus, setBookingStatusUpdatingStatus] = useState(false);
  const [activeBookingDetails, setActiveBookingDetails] = useState(null);
  const [showBookingDetailsModal, setshowBookingDetailsModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [courierPhone, setCourierPhone] = useState(null);
  const [courierNote, setCourierNote] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [activeNotes, setActiveNotes] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { auth: { routes, accountType, accountId } } = useContext(AuthContext);
  const csvLink = useRef();
  const isAdmin = auth.accountType === "ADMIN" && auth.accountId === "1";
  const isSubAdmin = auth.staff.privileges.includes('SUB_ADMIN');
  const editBookNotes = auth.staff.privileges.includes('EDIT_BOOKING_NOTES');
  const viewBookNotes = auth.staff.privileges.includes('VIEW_BOOKING_NOTES');
  const deleteBooking = auth.staff.privileges.includes('DELETE_BOOKING');
  const [bookingFilter, setBookingFilter] = useState({
    start: 0, status: '', dateFrom: '', dateTo: '', q: '', source_country: ''
  });
  const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
  };

  const handleNext = () => {
    setBookingFilter({ ...bookingFilter, start: (parseInt(bookingFilter.start) + 18) });
  };

  const handlePrev = () => {
    let strt = parseInt(bookingFilter.start) < 18 ? 0 : parseInt(bookingFilter.start) - 18;
    setBookingFilter({ ...bookingFilter, start: strt });
  };


  useEffect(() => {
    getBookingsForAgent();
  }, [bookingFilter.start]);

  const updateNote = (id, note) => {
    let tempBooks = [...books];
    tempBooks.map(bk => {
      if (bk.id === id) {
        bk.notes = note;
      }
      return bk;
    });
    setBooks(tempBooks);
  };


  const getBookingsForAgent = () => {
    setLoadingBooks(true);
    getBookingsForAgentReq(bookingFilter)
      .then((response) => {
        setBooks(response.data.bookings);
        setLoadingBooks(false);
      });
  };

  const getAllBookingsForCsv = () => {
    setLoadingCsvData(true);
    getAllBookingsForAgentReq(bookingFilter)
      .then((response) => {
        let tmpArray = [];
        // getAllBookingsForAgentReq

        let titles = Object.getOwnPropertyNames(response.data.bookings[0]);
        let index = titles.indexOf('items');
        if (index !== -1) {
          titles.splice(index, 1);
        }
        let ObjectWMaxItems = response.data.bookings.sort((a, b) => { return b.items.length - a.items.length })[0].items.length;
        if (ObjectWMaxItems > 0) {
          for (let i = 0; i < ObjectWMaxItems; i++) {
            // console.log(i + 1);
            titles.push('item_' + (i + 1));
            titles.push('item_' + (i + 1) + '_address');
          }
        }
        tmpArray.push(titles);
        response.data.bookings.map((bk, i) => {
          let row = [
            bk.id ?? '',
            bk.customer_id ?? '',
            bk.handled_staff_id ?? '',
            bk.source_country ?? '',
            bk.collection_address ?? '',
            bk.courier_visit_date ?? '',
            bk.handled_at ?? '',
            bk.canceled_at ?? '',
            bk.finished_at ?? '',
            bk.drop_off ?? '',
            bk.home_collection ?? '',
            bk.finished ?? '',
            bk.courier_phone ?? '',
            bk.created_at ?? '',
            bk.email ?? '',
            bk.ci_id ?? '',
            bk.ci_name ?? '',
            bk.ci_phone ?? '',
            bk.ci_address_country_code ?? '',
            bk.ci_address_line_1 ?? '',
            bk.ci_address_line_2 ?? '',
            bk.ci_address_postal_code ?? ''
          ];

          if (bk.items.length > 0) {
            bk.items.map((it, i) => {
              row.push(`Item id: ${it.item_id ?? '-'}\nDimensions: ${it.dimensions ?? '-'}\nFinished: ${it.finished ?? '-'}\nInsurance: ${it.insurance ?? '-'}\nTo be delivered: ${it.to_be_delivered ?? '-'}\nValue: ${it.value ?? '-'}\nWeight: ${it.weight ?? '-'}\nDetails: ${it.details ?? '-'}\n
                  `);
              row.push(`Name: ${it.receiver_address.name ?? '-'}\nphone: ${it.receiver_address.phone ?? '-'}\nemail: ${it.receiver_address.email ?? '-'}\nline_1: ${it.receiver_address.line_1 ?? '-'}\nline_2: ${it.receiver_address.line_2 ?? '-'}\ncountry_code: ${it.receiver_address.country_code ?? '-'}\npostal_code: ${it.receiver_address.postal_code ?? '-'}\n
                  `
              );
            });
          }
          tmpArray.push(row);
        });

        setCsvBooks(tmpArray);
        setLoadingCsvData(false);
        csvLink.current.link.click();
        setLoadingCsvData(false);

      });
  };


  // useEffect(() => {
  //   console.log(books);

  // }, [books]);

  const closeBookingDetailsModal = () => {
    setshowBookingDetailsModal(false);
  };

  const openBookingDetailsModal = (book) => {
    setActiveBookingDetails(book);
    setshowBookingDetailsModal(true);
  };

  const closeNotesModalModal = () => {
    setShowNotesModal(false);
  };

  const openNotesModalModal = (book) => {
    setActiveNotes(book);
    setShowNotesModal(true);
  };

  const closeHandleBookingForm = () => {
    setShowHandleBookingForm(false);
  };

  const openHandleBookingForm = (status) => {
    if (itemsToProceed.length < 1) {
      toast.error("Please select at least one booking.", toastOptions);
      return;
    }
    setStatus(status);
    setShowHandleBookingForm(true);
  };

  const selectBook = (book) => {
    if (!itemsToProceed.some(item => book.id === item.id)) {
      setItemsToProceed([...itemsToProceed, book]);
    }
    else {
      setItemsToProceed(itemsToProceed.filter(function (obj) {
        return obj.id !== book.id;
      }));

    }
  };

  const toggleAllBook = () => {
    if (itemsToProceed.length === books.length) {
      setItemsToProceed([]);
    } else {
      setItemsToProceed(books);
      // books.map(x => selectBook(x));
    }
  };

  const isChecked = (book) => {
    return itemsToProceed.find(x => x.id === book.id) ? true : false;
  };

  const proceedBooks = () => {
    setBookingStatusUpdatingStatus(true);
    if (status === 'delete') {
      agetDeleteBookingsReq({ ids: itemsToProceed.map(a => a.id) })
        .then((response) => {
          // console.log(response);
          if (response.data.error === true) {
            toast.error(response.data.message, toastOptions);
          } else {
            setBooks(current =>
              books.filter(obj => !itemsToProceed.find(x => x.id === obj.id)),
            );
            toast.success(response.data.message, toastOptions);
            setItemsToProceed([]);
            setShowHandleBookingForm(false);
          }
        });
    }
    else {
      agetProceedBookingsReq({ status: status, booking_ids: itemsToProceed.map(a => a.id), courier_phone: courierPhone, courier_note: courierNote }).
        then((response) => {
          if (response.data.error === true) {
            toast.error(response.data.message, toastOptions);
          }
          else {
            setBooks(current =>
              current.map(obj => {
                let new_obj = response.data.bookings.find(x => x.id === obj.id);
                if (new_obj) {
                  return new_obj;
                }
                return obj;

              }),
            );
            toast.success(response.data.message, toastOptions);
            setItemsToProceed([]);
            setShowHandleBookingForm(false);
          }
          setBookingStatusUpdatingStatus(false);
        }).catch((e) => {
          // console.log(e.data);
        });
    }
  };

  useEffect(() => {
    // console.log(bookingFilter);
  }, [bookingFilter]);

  const updateFilter = ({ key, value }) => {
    setBookingFilter((prev) => ({ ...prev, [key]: value }));
  }

  const getBookBorderStyle = (book) => {

    if (book.finished === 0 && book.courier_phone !== null && book.handled_staff_id.toString() === auth.staff.id) {
      return { border: "3px solid #1ea5de", backgroundColor: "#dbf4ff" };
    }

    if (book.finished === 0 && book.courier_phone === null) {
      return { border: "3px solid #a2cc3a", backgroundColor: "#f8ffe7" };
    }

    return { border: "3px solid #E2E2E2", backgroundColor: "#fff" };
  };

  return (
    <>
      <Row className={"mb-3"}>
        <Col xs={6} md={4} lg={2}>
          <label htmlFor="paymentFilter">Status</label>
          <select className={"form-control"} id="paymentFilter"
            value={bookingFilter.status}
            onChange={({ target: { value } }) => { updateFilter({ key: 'status', value }) }}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="HANDLED">Handled</option>
            <option value="CANCELED">Canceled</option>
            <option value="FINISHED">Finished</option>

          </select>
        </Col>
        <Col xs={6} md={4} lg={2}>
          <label htmlFor="route">Route:</label>
          <select className={"form-control"} id="route"
            value={bookingFilter.source_country}
            onChange={({ target: { value } }) => {
              updateFilter({ key: 'source_country', value: value });
            }}>
            <option value="">All</option>
            {[...new Set(routes.map(item => item.sourceCountryCode))].map((item, index) => (
              <option value={`${item}`} key={index}>{`${item}`}</option>
            ))}
          </select>
        </Col>

        <Col xs={6} md={4} lg={2}>
          <label htmlFor="dateFrom">Date from:</label>
          <input type={"date"} id="datefrom" className={"form-control"} value={bookingFilter.dateFrom}
            onChange={({ target: { value } }) => { updateFilter({ key: 'dateFrom', value }) }}
          />
        </Col>

        <Col xs={6} md={4} lg={2}>
          <label htmlFor="dateFrom">Date to:</label>
          <input type={"date"} id="dateto" className={"form-control"} value={bookingFilter.dateTo}
            onChange={({ target: { value } }) => { updateFilter({ key: 'dateTo', value }) }}
          />
        </Col>

        <Col xs={4} className="d-flex align-items-end btn-group">
          <Button variant={"primary"} block onClick={() => getBookingsForAgent()}>Filter</Button>
        </Col>

      </Row>
      <Row>
        <Col xs={12} md={4}>
          <input type={"text"} placeholder={"Filter through bookings with name or phone"} className={"form-control"} value={bookingFilter.q} onChange={({ target: { value } }) => { updateFilter({ key: 'q', value }) }} />
        </Col>
        <Col xs={12} md={2}>
          <Button variant={"primary"} block onClick={() => getBookingsForAgent()}>Search</Button>
        </Col>
      </Row>

      {loadingBooks && (
        <div className="d-flex justify-content-center align-items-center m-10">
          <Spinner animation="border" size="sm" />
        </div>
      )}

      <div className="container-fluid mt-5 mb-3">
        <div className="row">
          {true && (
            <div className="col-12 mb-2 border p-2 border-2 shadow">
              <button className="btn btn-secondary ms-1 btn-sm mb-1 mb-sm-0"
                onClick={() => openHandleBookingForm('handle')}
              >Handle ({itemsToProceed.length})</button>
              <button className="btn btn-secondary  ms-1 btn-sm mb-1 mb-sm-0"
                onClick={() => openHandleBookingForm('cancel')}
              >Cancel ({itemsToProceed.length})</button>
              <button className="btn btn-dark  ms-1 btn-sm mb-1 mb-sm-0"
                onClick={() => openHandleBookingForm('pending')}
              >Pending ({itemsToProceed.length})</button>
              <button className="btn btn-success  ms-1 btn-sm mb-1 mb-sm-0"
                onClick={() => openHandleBookingForm('finish')}
              >Finish ({itemsToProceed.length})</button>
              {deleteBooking && (isAdmin || isSubAdmin) && (
                <button className="btn btn-danger  ms-1 btn-sm mb-1 mb-sm-0"
                  onClick={() => openHandleBookingForm('delete')}
                >Delete ({itemsToProceed.length})</button>
              )}
              {!loadingBooks && (
                <>
                  <Button onClick={getAllBookingsForCsv}
                    className={"btn-sm ms-1 btn btn-outline-dark float-end"}>
                    {loadingCsvData ? 'Loading csv...' : 'Download CSV'}
                  </Button>
                  <CSVLink
                    data={csvBooks}
                    filename={"Bookings_" + new Date().toLocaleDateString() + ".csv"}
                    className='hidden'
                    ref={csvLink}
                    target='_blank'
                  />
                </>
              )}
            </div>
          )}
          <div className="col">
            {books && itemsToProceed && (
              <div class="form-check d-inline-block">
                <input className="form-check-input" type="checkbox" id="checkAll" style={{ zoom: "1.4" }}
                  checked={itemsToProceed.length === books.length}
                  onChange={(e) => toggleAllBook()} />
                <label class="form-check-label" for="checkAll" style={{ paddingTop: "6px" }}>
                  <b>Toggle all</b>
                </label>
              </div>
            )}
          </div>
        </div>

        {books && (books?.length > 0 || books !== undefined) && (
          <div className="text-center mb-2 mt-2">
            <nav aria-label="Page navigation" className="d-inline-block">
              <ul className="pagination">
                <li className={"page-item" + (bookingFilter.start == "0" ? " disabled" : "")}>
                  <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                </li>
                <li className={"page-item" + (books.length < 18 ? " disabled" : "")}>
                  <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        )}

        <div className="row">
          {!loadingBooks && (books?.length === 0 || books === undefined) && (
            <div className="alert alert-warning mt-2 w-100 d-inline-block mx-auto text-center" role="alert">
              Bookings not found
            </div>
          )}

          {!loadingBooks && (books?.length > 0 || books !== undefined) && books?.map((book, i) => (
            <>
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-2 rounded mb-3" style={getBookBorderStyle(book)} key={i}>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id={"nav-booking-" + i} role="tabpanel" aria-labelledby={"nav-booking-tab-" + i}>
                    <div className="p-1 shadow-none">
                      <div className="row">
                        <div className="my-auto p-0">
                          <div className="row m-0" style={{ width: "100%" }}>
                            <div className="col-2">
                              <span class="badge bg-success" title={book.id}>{book.id}</span>
                            </div>
                            <div className="col-2">
                              <input className="form-check-input" type="checkbox" id="flexCheckDefault" style={{ zoom: "1.4" }}
                                checked={isChecked(book)}
                                onChange={(e) => selectBook(book)} />
                            </div>
                            <div className="col-4">
                              <button className="btn btn-outline-info p-1 btn-sm " onClick={() => openBookingDetailsModal(book)}>
                                Details
                              </button>
                            </div>
                            <div className="col-4">
                              <button className={"btn btn-sm p-1 " + (book.web_notes?.concat(book.book_notes)?.filter(mp => mp.body.includes('@[' + auth.staff.username + ']')).length > 0 && book.book_notes[0]?.seen === 0 ? 'shake btn-warning' : 'btn-outline-danger')} onClick={() => openNotesModalModal({ ...book, booking: book.id, notes: book.web_notes?.concat(book.book_notes) })}>
                                <i className="me-1 bi bi-card-list"></i>({book.web_notes?.concat(book.book_notes)?.length > 9 ? '9+' : book.web_notes?.concat(book.book_notes)?.length})
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 my-auto">
                          {/* <input className="form-check-input" type="checkbox" id="flexCheckDefault" style={{ zoom: "2" }}
                            checked={isChecked(book)}
                            onChange={(e) => selectBook(book)} /> */}
                        </div>
                      </div>
                      {/* <hr className="mt-1 mb-1" /> */}
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          {/* <button className="btn btn-outline-info mt-1 mb-1 btn-sm p-1 " onClick={() => openBookingDetailsModal(book)}>
                            Details
                          </button> */}
                        </div>
                        <div className="col-12 col-sm-6">
                          {/* <button className="btn btn-outline-danger mb-1 mt-1 btn-sm p-1  " onClick={() => openNotesModalModal(book)}>
                            Notes({book.web_notes.concat(book.book_notes) .length})
                          </button> */}
                        </div>

                      </div>
                      {/* <small className="text-center">Booking ID: {book.id}</small>
                      <div className="mb-2 text-center">
                        <input className="form-check-input" type="checkbox" id="flexCheckDefault" style={{ zoom: "2" }}
                          checked={isChecked(book)}
                          onChange={(e) => selectBook(book)} />
                      </div> */}
                      <hr className="mt-1 mb-1" />
                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row align-items-center">
                          <div className="ms-2 c-details">
                            <h6 className="mb-0">{book.ci_name}</h6> <span>
                              {
                                moment(book.courier_visit_date).format(
                                  "D MMMM, YYYY"
                                )}
                            </span>
                          </div>
                        </div>
                        <div className="badge"> <span style={{ fontSize: "20px" }}>{flagEmoji(book.source_country)}</span> </div>
                      </div>
                      <div className="mt-3">
                        <span>
                          {
                            book.finished === 1 && book.canceled_at === null && (
                              <span style={{ fontSize: "14px" }} className="text-success">Picked Up at:&nbsp;
                                {
                                  moment(book.finished_at).format(
                                    "D MMMM, YYYY, h:mm:ss a"
                                  )}
                              </span>
                            )
                          }
                          {
                            book.canceled_at !== null && (
                              <span style={{ fontSize: "14px" }} className="text-danger">Canceled at: &nbsp;
                                {
                                  moment(book.canceled_at).format(
                                    "D MMMM, YYYY, h:mm:ss a"
                                  )}
                              </span>
                            )
                          }
                          {
                            book.finished === 0 && book.courier_phone !== null && (
                              <span style={{ fontSize: "14px" }} className="text-info">Handled at: &nbsp;
                                {
                                  moment(book.handled_at).format(
                                    "D MMMM, YYYY, h:mm:ss a"
                                  )}
                              </span>
                            )
                          }
                          {
                            book.finished === 0 && book.courier_phone === null && (
                              <>
                                <span style={{ fontSize: "14px" }} className="text-dark">Pending</span>
                              </>
                            )
                          }
                        </span>
                        <hr className="mt-1 mb-1" />
                        <span style={{ fontSize: "13px" }}>
                          {book.ci_name}
                          <br />
                          Address phone: <a href={'tel:' + book.ci_phone}>{book.ci_phone}</a>
                          <br />
                          User phone:<a href={'tel:' + book.phone}> {book.phone}</a>
                          <br />
                          {book.email}
                          <br />
                          {book.ci_address_line_1}
                          <br />
                          {book.ci_address_line_2}
                          <br />
                          {book.ci_address_postal_code}
                        </span>

                      </div>
                    </div>

                    {/* ・ */}

                  </div>
                  {/* {(isAdmin || isSubAdmin || viewBookNotes) && (
                    <div className="tab-pane fade" id={"nav-notes-" + i} role="tabpanel" aria-labelledby={"nav-notes-tab-" + i}>
                      <div className="form-floating mt-2">
                        <textarea
                          disabled={!editBookNotes}
                          className="form-control"
                          onChange={(e) => updateNote(book.id, e.target.value)}
                          placeholder="Leave a note here" id="floatingTextarea2" style={{ height: "300px" }}>{book.notes}</textarea>
                        <label for="floatingTextarea2">Notes</label>
                      </div>
                      {(editBookNotes || isAdmin || isSubAdmin) && (
                        <button className="btn btn-sm btn-primary mt-2 mb-4 float-end " onClick={() => handleUpdateNote(book.id)}>Update</button>
                      )}
                    </div>
                  )} */}
                </div>
              </div >

            </>

          ))}

        </div>

        {books && (books?.length > 0 || books !== undefined) && (
          <div className="text-center">
            <nav aria-label="Page navigation" className="d-inline-block">
              <ul className="pagination">
                <li className={"page-item" + (bookingFilter.start == "0" ? " disabled" : "")}>
                  <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                </li>
                <li className={"page-item" + (books.length < 18 ? " disabled" : "")}>
                  <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        )}

      </div >


      <Modal
        size="xl"
        onHide={closeHandleBookingForm}
        show={showHandleBookingForm}
        aria-labelledby="create-route-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="create-route-title">Handle Booking(s)</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <p>These bookings will be set to <b>{status}</b> by {auth.staff.username}.</p>
            <hr />
            <div className="row">
              {itemsToProceed !== [] && itemsToProceed.map((book, i) => (
                <div className="col-md-5 col-sm-10 col-lg-3 rounded ms-3 mb-3" style={getBookBorderStyle(book)} key={i}>
                  <div className="p-1 mb-2 shadow-none">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-row align-items-center">
                        <div className="ms-2 c-details">
                          <h6 className="mb-0">{book.ci_name}</h6> <span>
                            {
                              moment(book.courier_visit_date).format(
                                "D MMMM, YYYY"
                              )}
                          </span>
                        </div>
                      </div>
                      <div className="badge"> <span style={{ fontSize: "20px" }}>{flagEmoji(book.source_country)}</span> </div>
                    </div>
                    <div className="mt-3">
                      <span>
                        {
                          book.finished === 1 && book.courier_phone !== null && (
                            <span className="text-success">Picked Up at:&nbsp;
                              {
                                moment(book.finished_at).format(
                                  "D MMMM, YYYY, h:mm:ss a"
                                )}
                            </span>
                          )
                        }
                        {
                          book.finished === 1 && book.courier_phone === null && (
                            <span className="text-danger">Canceled at: &nbsp;
                              {
                                moment(book.canceled_at).format(
                                  "D MMMM, YYYY, h:mm:ss a"
                                )}
                            </span>
                          )
                        }
                        {
                          book.finished === 0 && book.courier_phone !== null && (
                            <span className="text-info">Handled at: &nbsp;
                              {
                                moment(book.handled_at).format(
                                  "D MMMM, YYYY, h:mm:ss a"
                                )}
                            </span>
                          )
                        }
                        {
                          book.finished === 0 && book.courier_phone === null && (
                            <span className="text-dark">Pending</span>
                          )
                        }
                      </span>
                      <hr />
                      {book.ci_name}
                      <br />
                      <a href={'tel:' + book.ci_phone}>{book.ci_phone}</a>
                      <br />
                      {book.email}
                      <br />
                      {book.ci_address_line_1}
                      <br />
                      {book.ci_address_line_2}
                      <br />
                      {book.ci_address_postal_code}

                    </div>
                  </div>
                </div>

              ))}
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          {status === 'handle' && (
            <>
              <div className="form-inline">
                <div className="form-group mx-sm-3 mb-2">
                  <label for="couriernote" className=""></label>
                  <input type="text" className={"form-control"}
                    id="courierphone" placeholder="Courier Note" name="courier_note"
                    value={courierNote}
                    {...register("courier_note", { required: false })}
                    onChange={(e) => setCourierNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-inline">
                <div className="form-group mx-sm-3 mb-2">
                  <label for="courierphone" className="">{errors.courier_phone && <div className="text-danger me-1">Courier phone is required</div>}</label>
                  <input type="text" className={"form-control " + (errors.courier_phone ? 'border border-danger' : '')}
                    id="courierphone" placeholder="Courier phone" name="courier_phone"
                    value={courierPhone}
                    {...register("courier_phone", { required: true })}
                    onChange={(e) => setCourierPhone(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <button className="btn btn-sm btn-success "
            onClick={handleSubmit(proceedBooks)}
            disabled={bookingStatusUpdatingStatus}
          >
            {!bookingStatusUpdatingStatus && (
              "Confirm"
            )}
            {bookingStatusUpdatingStatus && (
              <i className="fas fa-spinner fa-spin"></i>
            )}
          </button>
          <button className="btn btn-sm btn-white " onClick={closeHandleBookingForm}>Close</button>
        </Modal.Footer>
      </Modal>

      {
        activeBookingDetails && (
          <BookDetails
            activeBookingDetails={activeBookingDetails}
            closeBookingDetailsModal={closeBookingDetailsModal}
            showBookingDetailsModal={showBookingDetailsModal}
            openBookingDetailsModal={openBookingDetailsModal}
          />
        )
      }

      {activeNotes && (
        <BookNotesModal
          activeNotes={activeNotes}
          closeNotesModalModal={closeNotesModalModal}
          showNotesModal={showNotesModal}
          openNotesModalModal={openNotesModalModal}
          auth={auth}
          setActiveNotes={setActiveNotes}
          books={books}
          setBooks={setBooks}
          cargos={null}
          setCargos={null}
          canAddNote={true}
        />
      )}

    </>
  );
};

export default AgentBookings;