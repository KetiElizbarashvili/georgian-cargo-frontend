import { useRequest } from "hooks";
import { useContext, useEffect, useState } from "react";
import getStaff from "requests/getStaff";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import moment from "moment";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import updatePassword from "requests/updatePassword";
import { AuthContext } from "context";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import BookNotesModal from "components/BookNotesModal";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const passErrorsDiv = document.getElementById("password-form-errors");


const StaffProfile = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['last_viewed_mention']);
    const [updatePasswordReq] = useRequest(updatePassword, false, "password-form-errors");
    const [getStaffReq] = useRequest(getStaff);
    const { register: register2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, watch } = useForm();
    const [data, setData] = useState(null);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [updatePasswordObj, setUpdatePasswordObj] = useState({ current_password: null, password: null, confirm_password: null, token: null });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordUpdating, setPasswordUpdating] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);
    const [activeNotes, setActiveNotes] = useState(null);
    const [mentionsFilter, setMentionsFilter] = useState({
        start: 0
    });


    const handleNext = () => {
        setMentionsFilter({ ...mentionsFilter, start: (parseInt(mentionsFilter.start) + 10) });
    };

    const handlePrev = () => {
        let strt = parseInt(mentionsFilter.start) < 10 ? 0 : parseInt(mentionsFilter.start) - 10;
        setMentionsFilter({ ...mentionsFilter, start: strt });
    };

    const closeNotesModalModal = () => {
        setShowNotesModal(false);
    };

    const openNotesModalModal = (book) => {
        console.log(book);
        setActiveNotes(book);
        setShowNotesModal(true);
    };


    const handleGetStaff = () => {
        getStaffReq(mentionsFilter)
            .then(response => {
                // console.log(response); return;
                setData(response.data);
            });
    };

    const markMentionsViewed = () => {
        // console.log(data.mentions); return;
        let dat = JSON.stringify({ last_viewed_mention: data.mentions[0].id, expires: moment().add(1, "days").toDate() });
        localStorage.setItem('last_viewed_mention', dat);
        // setCookie('last_viewed_mention', data.mentions[0].id, { path: '/', expires: moment().add(1, "days").toDate() });
    };

    const onTodoChangePassword = (index, value) => {
        setUpdatePasswordObj({ ...updatePasswordObj, [index]: value });
    };

    useEffect(() => {
        setUpdatePasswordObj({ ...updatePasswordObj, token: auth.accessToken });
    }, []);

    useEffect(() => {
        handleGetStaff();
    }, [mentionsFilter.start]);

    const ChangePasswordModal = () => {
        setShowChangePassword(true);
    };

    const CloseChangePasswordModal = () => {
        setShowChangePassword(false);
    };

    const updatePasswordHandle = () => {
        setPasswordUpdating(true);
        // console.log(auth.accessToken);
        updatePasswordReq(updatePasswordObj)
            .then((response) => {
                if (response.data.error == true) {
                    toast.error(response.data.message + '. make sure your current password is right', toastOptions);
                }
                else {
                    setShowChangePassword(false);
                    toast.success("Password updated!", toastOptions);
                    passErrorsDiv.classList.add('d-none');
                }
            }).catch((e) => {
            });
        setPasswordUpdating(false);

    };


    return (
        <div className="row">
            <div className="col-md-2 mb-3">
                <ul className="nav nav-pills flex-column" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link position-relative"
                            onClick={() => markMentionsViewed()}
                            id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">
                            Mentions
                            {/* {console.log(
                                JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id
                                ===
                                JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention
                            )} */}
                            {((JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== undefined && JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention === undefined) || (JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention !== undefined && JSON.parse(localStorage.getItem('last_mentioned_id'))?.last_mentioned_id !== JSON.parse(localStorage.getItem('last_viewed_mention'))?.last_viewed_mention)) && (
                                <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                    <span className="visually-hidden">New alerts</span>
                                </span>
                            )}
                        </a>
                    </li>
                </ul>
            </div>
            <div className="col-md-10">
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        {data && (
                            <div className="card text-center">
                                <div className="card-header pb-0">
                                    <i style={{ fontSize: "50px" }} className="bi bi-person-circle"></i>
                                </div>
                                <div className="card-body pt-0 pb-0">
                                    <h3 className="card-title">{data.staff?.username}</h3>

                                </div>
                                <div className="card-footer text-muted pt-2">
                                    <OverlayTrigger
                                        placement="auto"
                                        trigger={["focus", "hover"]}
                                        overlay={(
                                            <Popover>
                                                <Popover.Title as="h6">
                                                    Date
                                                </Popover.Title>
                                                <Popover.Content>
                                                    {moment(data.staff?.created_at).format(
                                                        "D MMMM, YYYY, h:mm:ss a"
                                                    )}
                                                </Popover.Content>
                                            </Popover>
                                        )}>
                                        <div role="button">
                                            Registered {moment(data.staff?.created_at).fromNow()}
                                        </div>
                                    </OverlayTrigger>
                                    <a href="#" onClick={() => setShowChangePassword(true)} className="btn btn-primary btn-sm mt-2">Change Password</a>
                                </div>
                            </div>
                        )}

                    </div>
                    <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                        {console.log(data, 111111111)}
                        {data && data.mentions && data.mentions.length > 0 && data.mentions.map((me, i) => (
                            <div className="card pb-0 mb-3" key={i} style={{ backgroundColor: 'rgb(225 225 225)' }}>
                                <span className="p-2">
                                    <Link role="button" to={`/manage/agent/${me.staff_id}`}>{me.username}</Link> Mentioned you on {JSON.parse(me.data).type}:
                                    {JSON.parse(me.data).type === 'cargo' ? (
                                        <a role="button" className="badge bg-success text-white ms-1"
                                            onClick={() => openNotesModalModal({
                                                staff: [...new Map(data.staff.map(item =>
                                                    [item['id'], item])).values()], tracking: JSON.parse(me.data).id, notes: data.web_notes.filter(x => x.tracking === JSON.parse(me.data).id)
                                            })}>{JSON.parse(me.data).id}</a>
                                    ) : (
                                        <a role="button" className="badge bg-info text-white ms-1"
                                            onClick={() => openNotesModalModal({
                                                staff: [...new Map(data.staff.map(item =>
                                                    [item['id'], item])).values()], booking: JSON.parse(me.data).id, notes: data.book_notes.filter(x => x.book_id === JSON.parse(me.data).id)
                                            })}>{JSON.parse(me.data).id}</a>
                                    )}
                                </span>
                                <div className="card p-2 shadow">
                                    <div className="d-flex justify-content-between align-items-center">

                                        <div className="user d-flex flex-row align-items-center">

                                            <span><small className="font-weight-bold text-primary"> <Link role="button" to={`/manage/agent/${me.staff_id}`}>{me.username}</Link></small>
                                                <small style={{ fontSize: "12px" }} className="text-muted"> -
                                                    {
                                                        moment(me.created_at).format(
                                                            "D MMMM, YYYY - HH:mm"
                                                        )
                                                    }
                                                </small>
                                                <div className="clearfix" />
                                                <p className="font-weight-bold mb-0" dangerouslySetInnerHTML={{
                                                    __html: me.body.replace(/@\[([^\]]+)\]\((\d+)\)/g, (match, username, id) => {
                                                        return `<span class='badge bg-primary me-1'>${username}</span>`;
                                                    })
                                                }} />
                                            </span>

                                        </div>

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
                            </div>
                        ))}
                        {data && data.mentions && (data.mentions?.length > 0 || data.mentions !== undefined) && (
                            <div className="text-center mb-2 mt-2">
                                <nav aria-label="Page navigation" className="d-inline-block">
                                    <ul className="pagination">
                                        <li className={"page-item" + (mentionsFilter.start == "0" ? " disabled" : "")}>
                                            <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                                        </li>
                                        <li className={"page-item" + (data.mentions.length < 18 ? " disabled" : "")}>
                                            <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                size="md"
                onHide={CloseChangePasswordModal}
                show={showChangePassword}
                aria-labelledby="create-route-title"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="create-route-title">Change password</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <>
                        <div style={{ whiteSpace: "pre" }} id="password-form-errors" className="alert alert-danger d-none" role="alert">
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputEmail1">Old password</label>
                            <input type="password" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                // {...register2("current_password", { required: true })}
                                onChange={e => onTodoChangePassword('current_password', e.target.value)}
                            />
                            {errors2.current_password && <p className="text-danger d-block w-full">Please check old password</p>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputPassword">New password</label>
                            <input type="password" className="form-control" id="exampleInputPassword"
                                // {...register2("password", { required: true, minLength: 8 })}
                                onChange={e => onTodoChangePassword('password', e.target.value)}
                            />
                            {errors2.password && <p className="text-danger d-block w-full">Please check new password</p>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputPasswordRepeat">Repeat new password</label>
                            <input type="password" className="form-control" id="exampleInputPasswordRepeat"
                                // {...register2("confirm_password", { required: true, validate: (val) => {
                                //   if (watch('password') != val) {
                                //     return "Your passwords do not match";
                                //   }
                                // },})}
                                onChange={e => onTodoChangePassword('confirm_password', e.target.value)}
                            />
                            {errors2.confirm_password && <p className="text-danger d-block w-full">Please check new confirm password</p>}
                        </div>
                        <button className="btn btn-sm btn-white " onClick={CloseChangePasswordModal}>Close</button>
                        <button
                            disabled={passwordUpdating}
                            className="btn btn-sm btn-secondary  float-end" onClick={() => updatePasswordHandle()} >Save changes</button>
                    </>
                </Modal.Body>
            </Modal>
            {
                activeNotes && (
                    <BookNotesModal
                        activeNotes={activeNotes}
                        closeNotesModalModal={closeNotesModalModal}
                        showNotesModal={showNotesModal}
                        openNotesModalModal={openNotesModalModal}
                        auth={auth}
                        setActiveNotes={setActiveNotes}
                        books={null}
                        setBooks={null}
                        cargos={null}
                        setCargos={null}
                        canAddNote={true}
                    />
                )
            }
        </div >
    );
};

export default StaffProfile;