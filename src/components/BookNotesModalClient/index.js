import moment from "moment";
import { Modal } from "react-bootstrap";
import { useRequest } from "hooks";
import storeBookingClientNote from "requests/storeBookingClientNote";
import deleteBookingAgentNote from "requests/deleteBookingAgentNote";
import shareBookingNotes from "requests/shareBookingNotes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MentionsInput, Mention } from 'react-mentions'
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const BookNotesModalClient = ({ canAddNote, openNotesModalModal, showNotesModal, closeNotesModalModal, activeNotes, setActiveNotes, books, setBooks, auth }) => {
    // const { auth } = useContext(AuthContext);
    const [storeBookingClientNoteReq] = useRequest(storeBookingClientNote);
    const [deleteBookingAgentNoteReq] = useRequest(deleteBookingAgentNote);
    const [shareBookingNotesReq] = useRequest(shareBookingNotes);

    const [newNote, setNewNote] = useState({
        body: ''
    });

    const [storingNote, setStoringNote] = useState(false);

    const handleToggleShare = (book) => {
        if (book.notes.length < 1) {
            toast.error('To share notes it must have at least one note.', toastOptions);
            return;
        }
        shareBookingNotesReq({ tracking: activeNotes?.tracking, booking: activeNotes?.booking })
            .then((response) => {
                console.log(response);
                if (response?.data?.error === true) {
                    toast.error(response.data.message, toastOptions);
                } else {
                    let nts = [...activeNotes.notes];
                    nts.map(nt => nt.public = 1 - nt.public);
                    setActiveNotes({
                        ...activeNotes, notes: nts
                    });
                    toast.success('Sharing status updated.', toastOptions);
                }
            })
        // console.log(note.id);
    };
    const renderSuggestion = (entry) => {
        return <div className="badge bg-dark w-100 rounded-0">{entry.display}</div>;
    };
    // console.log(activeNotes);
    const handleDeleteNote = (note) => {
        deleteBookingAgentNoteReq({ id: note.id, type: note.type })
            .then((response) => {
                if (response?.data?.error === true) {
                    toast.error(response.data.message, toastOptions);
                } else {
                    let ntsWeb = [...activeNotes.notes].filter(x => x.type === 'cargo');
                    let ntsBook = [...activeNotes.notes].filter(x => x.type === 'book');

                    setActiveNotes({
                        ...activeNotes, notes: (note.type === 'book' ? ntsBook.filter(nt => nt.id !== note.id).concat(ntsWeb) : ntsWeb.filter(nt => nt.id !== note.id).concat(ntsBook))
                    });
                    if (activeNotes.booking) {
                        let bks = [...books];
                        setBooks(bks.map(bk => {
                            if (bk.id === note.book_id) {
                                if (note.type === 'cargo') {
                                    bk.web_notes = ntsWeb.filter(nt => nt.id !== note.id);
                                } else {
                                    bk.book_notes = ntsBook.filter(nt => nt.id !== note.id);
                                }
                            }
                            return bk;
                        }));
                    } else {
                        let crgs = [...books];
                        setBooks(crgs.map(cg => {
                            if (cg.tracking_number === note.tracking) {
                                if (note.type === 'cargo') {
                                    cg.web_notes = ntsWeb.filter(nt => nt.id !== note.id);
                                } else {
                                    cg.book_notes = ntsBook.filter(nt => nt.id !== note.id);
                                }
                            }
                            return cg;
                        }));
                    }

                    toast.success('Note deleted.', toastOptions);
                }
            })
    };
    const handleStoreNote = () => {
        setStoringNote(true);
        storeBookingClientNoteReq({ tracking: activeNotes?.tracking, booking: activeNotes?.id, body: newNote.body })
            .then((response) => {
                if (response === undefined || response?.data?.error === true) {
                    toast.error(response?.data?.message, toastOptions);
                } else {
                    // console.log(activeNotes); return;
                    if (activeNotes.booking) {
                        let bks = [...books];
                        setBooks(bks.map(bk => {
                            if (bk.id === activeNotes.id) {
                                if (activeNotes.type === 'cargo') {
                                    bk.web_notes.push(response.data.note);
                                } else {
                                    bk.book_notes.push(response.data.note);
                                }
                            }
                            return bk;
                        }));
                    } else {
                        let bks = [...books];
                        setBooks(bks.map(bk => {
                            if (bk.tracking_number === activeNotes.tracking) {
                                if (activeNotes.type === 'cargo') {
                                    bk.web_notes.push(response.data.note);
                                } else {
                                    bk.book_notes.push(response.data.note);
                                }
                            }
                            return bk;
                        }));
                    }
                    let nt = [...activeNotes.notes];
                    nt.push(response.data.note);
                    setActiveNotes({ ...activeNotes, notes: nt });
                    toast.success('Note saved.', toastOptions);
                    setNewNote({ body: '' });
                }
                setStoringNote(false);
            })
    };

    useEffect(() => {
        // console.log(newNote);
    }, [newNote]);

    return (
        <Modal
            size="xl"
            onHide={closeNotesModalModal}
            show={showNotesModal}
            aria-labelledby="create-route-title"
            centered
        >
            <Modal.Header closeButton style={{ backgroundColor: "#f9f9f9" }}>
                <Modal.Title id="create-route-title">notes</Modal.Title>
                {/* <button className="btn btn-secondary btn-sm ms-2" onClick={() => { getPDF() }}>
          PDF
        </button> */}
                {canAddNote && (
                    <span className="badge d-flex flex-row align-items-center">
                        <span className="text-primary me-2 my-auto">Share for client</span>
                        <div className="form-check form-switch">
                            <input className="form-check-input"
                                onChange={() => handleToggleShare(activeNotes)}
                                type="checkbox" id="flexSwitchCheckChecked" checked={typeof activeNotes?.notes[0] === 'undefined' ? false : activeNotes?.notes[0]?.public === 1} />
                        </div>
                    </span>
                )}
            </Modal.Header>

            <Modal.Body
                style={{
                    paddingTop: "0px", backgroundColor: "#f9f9f9", height: "70vh",
                    overflowY: "auto"
                }}
                id="">
                <>
                    <div className="container mt-5">

                        <div className="row  d-flex justify-content-center">
                            <div className="col-md-12">
                                {activeNotes && activeNotes.notes && activeNotes.notes.length < 1 && (
                                    <div className="alert alert-warning">notes not found</div>
                                )}
                                {activeNotes && activeNotes.notes && activeNotes.notes.length > 0 && activeNotes.notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((note, i) => (
                                    <div className="card p-2 mb-2" key={i} >

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div className="user d-flex flex-row align-items-center">

                                                <span><small className="font-weight-bold text-primary">{note?.customer_id !== null && (<i className="bi bi-person-badge me-1"></i>)}
                                                    {note.username}
                                                </small>
                                                    <small style={{ fontSize: "12px" }} className="text-muted"> -
                                                        {
                                                            moment(note.created_at).format(
                                                                "D MMMM, YYYY - HH:mm"
                                                            )
                                                        }
                                                    </small>
                                                    <div className="clearfix" />
                                                    {canAddNote ? (
                                                        <p className="font-weight-bold mb-0" dangerouslySetInnerHTML={{
                                                            __html: note.body.replace(/@\[([^\]]+)\]\((\d+)\)/g, (match, username, id) => {
                                                                return `<span class='badge bg-primary me-1'>${username}</span>`;
                                                            })
                                                        }} />

                                                    ) : (
                                                        <p className="font-weight-bold mb-0">{note.body}</p>
                                                    )}
                                                </span>

                                            </div>


                                            {(parseInt(auth.staff.id) === 1 || parseInt(auth.staff.id) === parseInt(note.staff_id)) && canAddNote && (
                                                <div style={{ fontSize: "12px" }}>
                                                    <div className="reply" style={{ minWidth: "35px" }}>
                                                        <i
                                                            onClick={() => handleDeleteNote(note)}
                                                            role="button" className="bi bi-trash me-1 text-danger"></i>
                                                    </div>
                                                </div>
                                            )}

                                        </div>


                                        <div className="action mt-2 text-end">
                                            {/* {(parseInt(auth.staff.id) === 1 || parseInt(auth.staff.id) === parseInt(note.staff_id)) && (
                                                <div className="reply">
                                                    <i role="button" className="bi bi-pencil-square me-1"></i>
                                                    <i role="button" className="bi bi-trash me-1 text-danger"></i>
                                                </div>
                                            )} */}

                                            {/* <div className="icons align-items-center">

                                            <i className="fa fa-star text-warning"></i>
                                            <i className="fa fa-check-circle-o check-icon"></i>

                                        </div> */}

                                        </div>



                                    </div>
                                ))}




                            </div>

                        </div>

                    </div>

                </>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "rgb(233 233 233)" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10">
                            <div className="mb-3 d-block w-100">
                                {/* {console.log(activeNotes.staff.map(x => x.username))} */}
                                {/* <textarea
                                        className="form-control"
                                        onChange={)}
                                        value={newNote.body}
                                        id="exampleFormControlTextarea1" rows="1" placeholder="Note text"></textarea> */}
                                <MentionsInput
                                    className="form-control"
                                    value={newNote.body} onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}>
                                    <Mention
                                        trigger="@"
                                        data={activeNotes.staff}
                                        renderSuggestion={renderSuggestion}
                                    />
                                </MentionsInput>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button
                                disabled={storingNote}
                                onClick={handleStoreNote}
                                className="btn btn-primary w-100">Add</button>
                        </div>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default BookNotesModalClient;
