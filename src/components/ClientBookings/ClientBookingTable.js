import React, { useState, useEffect, useContext } from "react";
import { useRequest } from "hooks";
import Spinner from "react-bootstrap/Spinner";
import getBookings from "requests/getBookings";
import cancelBooking from "requests/cancelBooking";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { AuthContext } from "context";
// import QRCode from "react-qr-code";
import BookDetails from "./BookDetails";
import BookNotesModalClient from "components/BookNotesModalClient";

const ClientBookingTable = () => {
  const [getClientBookings] = useRequest(getBookings);
  const [cancelBookingReq] = useRequest(cancelBooking);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [showBookingDetailsModal, setshowBookingDetailsModal] = useState(false);
  const [activeBookingDetails, setActiveBookingDetails] = useState(null);
  const [start, setStart] = useState(0);
  const [bookingStatusUpdatingStatus, setBookingStatusUpdatingStatus] = useState(false);
  const [activeNotes, setActiveNotes] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const closeBookingDetailsModal = () => {
    setshowBookingDetailsModal(false);
  };

  const openBookingDetailsModal = (book) => {
    setActiveBookingDetails(book);
    setshowBookingDetailsModal(true);
  };
  const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
  };

  const handleCancelBooking = (book) => {
    setBookingStatusUpdatingStatus(true);
    cancelBookingReq(book)
      .then((response) => {
        if (response.data.error === true) {
          toast.error(response.data.message, toastOptions);
        }
        else {
          toast.success("Booking canceled successfully!", toastOptions);
          setBookings(current =>
            current.map(obj => {
              if (obj.id === response.data.book.id) {
                return { ...obj, finished: 1 };
              }

              return obj;
            }),
          );
        }
        setBookingStatusUpdatingStatus(false);
      });
  };

  const closeNotesModalModal = () => {
    setShowNotesModal(false);
  };

  const openNotesModalModal = (book) => {
    setActiveNotes(book);
    setShowNotesModal(true);
  };

  const getClientBookingsData = () => {
    setLoadingBooking(true);
    getClientBookings({ start: start })
      .then((response) => {
        console.log(response);
        setBookings(response.data.bookings);
        setLoadingBooking(false);
      });
  };

  useEffect(() => {
    getClientBookingsData();
  }, [start]);

  const handleNext = () => {
    setStart(start + 6);
  };

  const handlePrev = () => {
    let strt = parseInt(start) < 6 ? 0 : parseInt(start) - 6;
    setStart(strt);
  };


  return (
    <>
      {loadingBooking && (
        <div className="d-flex justify-content-center align-items-center m-10">
          <Spinner animation="border" size="sm" />
        </div>
      )}
      {!loadingBooking && (
        <div className="d-grid gap-3 gap-lg-5">
          <div className="card">
            <div className="card-header border-bottom">
              <h4 className="card-header-title">Bookings</h4>
            </div>

            <ul className="card-body">
              {bookings && bookings.length > 0 && bookings.map((book, i) => (

                <li style={!book.finished ? { border: "2px solid #a2cc3a" } : {}} className={"card card-bordered shadow-none mb-3 "} key={i}>
                  <div className="card-body mb-4">
                    <div className="card-header border-bottom d-block p-0 pb-2 mb-2">
                      <div className="row">
                        <div className="col-md-3 mb-3 mb-md-0">
                          <small className="card-subtitle mb-0">Status</small>
                          {!book.finished && (
                            <span className="badge badge bg-success">Active</span>
                          )}
                          {book.finished === 1 && (
                            <span className="badge badge bg-primary">Finished</span>
                          )}
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <small className="card-subtitle mb-0">Booking ID</small>
                          <span className="badge badge bg-success">{book.id}</span>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <small className="card-subtitle mb-0">Courier</small>
                          <small className="text-dark fw-semibold">
                            {book.finished === 1 && book.courier_phone !== null && (
                              <>Handled</>
                            )}

                            {book.finished === 0 && book.courier_phone !== null && (
                              <>
                                On the way
                                <br />
                                Courier Phone: {book.courier_phone}
                              </>
                            )}

                            {book.finished === 0 && book.courier_phone === null && (
                              <> Pending</>
                            )}

                            {book.finished === 1 && book.courier_phone === null && (
                              <> Canceled </>
                            )}

                          </small>


                        </div>

                        <div className="col-md-3">
                          <small className="card-subtitle mb-0">Preferable visit date:</small>
                          <small className="text-dark fw-semibold">
                            {
                              moment(book.courier_visit_date).format(
                                "D MMMM, YYYY"
                              )}
                          </small>
                        </div>
                      </div>
                      {book.courier_note !== null && book.courier_note?.toString().length > 0 && (

                        <div className="mt-1 alert alert-info d-flex align-items-center" role="alert">
                          <i className="text-white me-2 bi bi-info-circle-fill"></i>
                          <div>
                            Note from Courier: {book.courier_note}
                          </div>
                        </div>
                      )}
                    </div>


                    <div className="row">
                      {!book.finished && (
                        <div className="col-md-8">
                          <div className="row gx-2">
                            <div className="col mt-2">

                              <img className='qrCodeClient' src={"https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + auth.staff.email + "&choe=UTF-8"} />
                            </div>
                            <div className="col">
                            </div>
                          </div>
                        </div>
                      )}

                      {book.finished === 1 && (
                        <div className="col-md-8">
                        </div>
                      )}
                      <div className="col-md-4">
                        <div className="d-grid gap-2 mt-2">
                          <button className="btn btn-link btn-sm " onClick={() => openBookingDetailsModal(book)}>
                            View details
                          </button>
                          <button className="btn btn-link btn-sm mb-2 text-danger " onClick={() => openNotesModalModal(book)}>
                            View notes({book.book_notes.concat(book?.web_notes).length})
                          </button>
                          {!book.finished && (
                            <button className="btn btn-danger btn-sm mb-2  text-white" onClick={() => handleCancelBooking(book)}
                              disabled={bookingStatusUpdatingStatus}
                            >Cancel booking
                              &nbsp;
                              {bookingStatusUpdatingStatus && (
                                <i className="fas fa-spinner fa-spin"></i>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>


                  </div>
                  {!book.finished && (
                    <div className="card-footer text-muted">
                      Show QR code to courier when he/she arrives or tell your email: <span className="fw-bold">{auth.staff.email}</span>
                      <br />
                      <small>Copy of QR code also was sent to your email.</small>
                    </div>
                  )}
                </li>

              ))}
              {bookings && bookings.length < 1 && (
                <div className="alert alert-warning mt-2 w-100 d-inline-block mx-auto text-center" role="alert">
                  Bookings not found
                </div>
              )}

              <nav aria-label="Page navigation" className="pb-4 d-block mx-auto">
                <ul className="pagination justify-content-center">
                  <li className={"page-item" + (start == "0" ? " disabled" : "")}>
                    <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                  </li>
                  <li className={"page-item" + (bookings == null || bookings.length == 0 || bookings.length < 6 ? " disabled" : "")}>
                    <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                  </li>
                </ul>
              </nav>
            </ul>
          </div>

          <div className="card-footer pt-4">
            <div className="d-inline-block float-start">

            </div>
            <div className="d-inline-block float-end">

            </div>
          </div>
        </div>
      )}
      {activeBookingDetails && (
        <BookDetails
          activeBookingDetails={activeBookingDetails}
          closeBookingDetailsModal={closeBookingDetailsModal}
          showBookingDetailsModal={showBookingDetailsModal}
          openBookingDetailsModal={openBookingDetailsModal}
        />
      )}
      {activeNotes && activeNotes.book_notes.concat(activeNotes?.web_notes).length > 0 && (
        <BookNotesModalClient
          activeNotes={{ ...activeNotes, notes: activeNotes.book_notes.concat(activeNotes?.web_notes) }}
          closeNotesModalModal={closeNotesModalModal}
          showNotesModal={showNotesModal}
          openNotesModalModal={openNotesModalModal}
          auth={auth}
          setActiveNotes={setActiveNotes}
          books={bookings}
          setBooks={setBookings}
          canAddNote={false}
        />
      )}

    </>
  );
};

export default ClientBookingTable;