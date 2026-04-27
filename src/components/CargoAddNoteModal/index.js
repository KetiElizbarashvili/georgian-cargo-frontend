import { AuthContext } from "context";
import { useRequest } from "hooks";
import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import storeAgentNote from "requests/storeAgentNote";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};


const CargoAddNoteModal = ({ id, show, setShow, setData, data }) => {
    const { auth } = useContext(AuthContext);
    const [storeCargoNoteReq] = useRequest(storeAgentNote);
    const [storingNote, setStoringNote] = useState(false);
    const [newNote, setNewNote] = useState({
        id: id,
        body: "",
        username: "",
    });

    const handleStoreNote = () => {
        setStoringNote(true);
        console.log(newNote);
        storeCargoNoteReq(newNote)
            .then((response) => {
                if (response === undefined || response?.data?.error === true) {
                    toast.error(response.data.message, toastOptions);
                } else {
                    setData();
                    toast.success('Note saved.', toastOptions);
                    setNewNote({ id: id, body: "" });
                    let dat = { ...data };
                    dat.web_notes.unshift({ ...newNote, username: auth.staff.username });
                    setData(dat);
                    setShow(false);
                }
                setStoringNote(false);
            })
    };


    return (
        <Modal
            size="lg"
            onHide={() => setShow(false)}
            show={show}
            fullscreen={true}
            aria-labelledby="create-route-title"
            backdrop="static"
            centered
        >
            {/* <Modal.Header  /> */}
            <Modal.Header closeButton>
                <h3>Add Note</h3>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10">
                                <div className="mb-3 d-block w-100">
                                    <textarea
                                        className="form-control"
                                        onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
                                        value={newNote.body}
                                        id="exampleFormControlTextarea1" rows="1" placeholder="Note text"></textarea>
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
                </>
            </Modal.Body>
        </Modal>
    );
};

export default CargoAddNoteModal;