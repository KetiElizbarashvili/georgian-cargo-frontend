import { Col, Row, Button, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRequest } from "hooks";
import moment from "moment";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { listStaff } from "requests/listStaff";
import { getStaffPrivileges } from "requests/getStaffPrivileges";
import { updateStaff } from "requests/updateStaff";
import { flagEmoji } from "utils/FlagEmoji";
import { getRoutesAll } from "requests/getRoutesAll";
import { useForm } from "react-hook-form";
import { saveStaff } from "requests/saveStaff"

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const PrivateAgents = () => {
    const { setValue, register, trigger, reset, formState: { errors }, handleSubmit, watch } = useForm();
    const { setValue: setValue2, register: register2, trigger: trigger2, reset: reset2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, watch: watch2 } = useForm();

    const { setValue: setValue3, register: register3, trigger: trigger3, reset: reset3, formState: { errors: errors3 }, handleSubmit: handleSubmit3, watch: watch3 } = useForm();

    const [listStaffReq] = useRequest(listStaff);
    const [getStaffPrivilegesReq] = useRequest(getStaffPrivileges);
    const [updateStaffReq] = useRequest(updateStaff);
    const [getRoutesAllReq] = useRequest(getRoutesAll);
    const [saveStaffReq] = useRequest(saveStaff);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [allPrivileges, setAllPrivileges] = useState([]);
    const [allRoutes, setAllRoutes] = useState([]);
    const [privilegesModal, setPrivilegesModal] = useState(false);
    const [routesModal, setRoutesModal] = useState(false);
    const [updatePasswordModal, setUpdatePasswordModal] = useState(false);
    const [newAgent, setNewAgent] = useState(false);
    const [updateUsernameModal, setUpdateUsernameModal] = useState(false);
    const [passwordObj, setPasswordObj] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [newAgentObj, setNewAgentObj] = useState({
        username: '',
        password: '',
        confirm_password: ''
    });

    const [usernameObj, setUsernameObj] = useState({
        new_username: '',
    });
    const [filter, setFilter] = useState({
        start: 0,
        limit: 10,
        query: ""
    });
    const [data, setData] = useState([]);
    const [itemsToProceed, setItemsToProceed] = useState([]);


    const handleNext = () => {
        setFilter({ ...filter, start: (parseInt(filter.start) + filter.limit) });
    };

    const handlePrev = () => {
        let strt = parseInt(filter.start) < filter.limit ? 0 : parseInt(filter.start) - filter.limit;
        setFilter({ ...filter, start: strt });
    };

    const toggleAll = () => {
        if (itemsToProceed.length === data.length) {
            setItemsToProceed([]);
        } else {
            setItemsToProceed(data);
        }
    };

    useEffect(() => {
        getStaffPrivilegesReq()
            .then((response) => {
                setAllPrivileges(response.data.privileges);
            });
        getRoutesAllReq()
            .then((response) => {
                console.log(response.data.routes);
                setAllRoutes(response.data.routes);
            });

    }, []);

    useEffect(() => {
        listStaffReq(filter)
            .then((response) => {
                setData(response.data.agents);
                console.log(response.data.agents);
            })
    }, [filter]);

    const removePrivilege = (p) => {
        let prvlgs = JSON.parse(selectedAgent.privileges).filter(x => x !== p);
        setSelectedAgent({ ...selectedAgent, privileges: JSON.stringify(prvlgs) });
    };

    const addPrivileges = (p) => {
        let prvlgs = JSON.parse(selectedAgent.privileges);
        prvlgs.push(p);
        setSelectedAgent({ ...selectedAgent, privileges: JSON.stringify(prvlgs) });
    };


    const handleUpdateStaffPassword = () => {
        setUpdating(true);
        updateStaffReq({
            username: selectedAgent.username,
            privileges: JSON.parse(selectedAgent.privileges),
            routes: JSON.parse(selectedAgent.routes === null ? '[]' : selectedAgent.routes.replace(/'/g, '"')),
            new_username: '',
            new_password: passwordObj.new_password,
            confirm_password: passwordObj.confirm_password
        })
            .then(response => {
                if (!response.data.error) {
                    setSelectedAgent(null);
                    reset();
                    toast.success("Password updated Successfully!");
                }
                console.log(response);
            });
        setUpdating(false);
    };

    const handleUpdateStaffUsername = () => {
        setUpdating(true);
        updateStaffReq({
            username: selectedAgent.username,
            privileges: JSON.parse(selectedAgent.privileges),
            routes: JSON.parse(selectedAgent.routes === null ? '[]' : selectedAgent.routes.replace(/'/g, '"')),
            new_username: usernameObj.new_username,
            new_password: '',
            confirm_password: ''
        })
            .then(response => {
                if (!response.data.error) {
                    let usrs = [...data].map(x => {
                        if (x.username === selectedAgent.username) {
                            return { ...x, username: usernameObj.new_username };
                        } else {
                            return x;
                        }
                    });
                    setData(usrs);
                    setSelectedAgent(null);
                    reset();
                    toast.success("Username updated Successfully!");
                }
                console.log(response);
            });
        setUpdateUsernameModal(false);
        setUpdating(false);
    };

    const handleUpdateStaffPrivilegesRoutes = () => {
        setUpdating(true);
        updateStaffReq({
            username: selectedAgent.username,
            privileges: JSON.parse(selectedAgent.privileges),
            routes: JSON.parse(selectedAgent.routes === null ? '[]' : selectedAgent.routes.replace(/'/g, '"')),
            new_username: '',
            new_password: '',
            confirm_password: ''
        })
            .then(response => {
                if (!response.data.error) {
                    let usrs = [...data].map(x => {
                        if (parseInt(x.id) === parseInt(selectedAgent.id)) {
                            return selectedAgent;
                        } else {
                            return x;
                        }
                    });
                    setData(usrs);
                    setSelectedAgent(null);
                    setPasswordObj({ new_password: "", confirm_password: "" });
                    toast.success("Privileges updated Successfully!");
                }
                console.log(response);
            });
        setUpdating(false);
    };

    const removeRouteFromAgent = (r) => {
        let arts = JSON.parse(selectedAgent.routes.replace(/'/g, '"')).filter(x => JSON.stringify(x) !== JSON.stringify(r)
        );
        setSelectedAgent({ ...selectedAgent, routes: JSON.stringify(arts) });
    };

    const addRouteToAgent = (r) => {
        let arts = JSON.parse(selectedAgent.routes === null ? '[]' : selectedAgent.routes.replace(/'/g, '"'));
        arts.push([r.source_country_code, r.destination_country_code]);
        setSelectedAgent({ ...selectedAgent, routes: JSON.stringify(arts) });
    };

    const handleNewAgent = () => {
        saveStaffReq(newAgentObj)
            .then(response => {
                let usrs = [...data];
                usrs.push({ id: parseInt(data[data.length - 1].id) + 1, username: newAgentObj.username, routes: '[]', privileges: '[]' });
                setData(usrs);
                setNewAgentObj({
                    username: '',
                    password: '',
                    confirm_password: ''
                });
                reset3();
                setNewAgent(false);
                toast.success("Agent added Successfully!");
            })
    };


    return (
        <>
            <div className="bg-white">
                <div className="btn-group float-start m-2" role="group" aria-label="Basic example">
                    <button type="button" className={"btn " + (filter.limit === 10 ? 'btn-light' : 'btn-info')} onClick={() => setFilter({ ...filter, limit: 10 })}>10</button>
                    <button type="button" className={"btn " + (filter.limit === 50 ? 'btn-light' : 'btn-info')} onClick={() => setFilter({ ...filter, limit: 50 })}>50</button>
                    <button type="button" className={"btn " + (filter.limit === 100 ? 'btn-light' : 'btn-info')} onClick={() => setFilter({ ...filter, limit: 100 })}>100</button>
                </div>
                <div className="dropdown float-start m-2">
                    {/* <button disabled={itemsToProceed.length < 1} className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </button> */}
                    <ul className="dropdown-menu">
                        {/* <li><a className="dropdown-item rounded-0"
                        role="button"
                        onClick={() => setGivening(true)}>Download CSV ({itemsToProceed.length})</a></li> */}
                        <li><a
                            className="dropdown-item bg-danger text-white rounded-0"
                            role="button"
                            onClick={() => ""}>Delete ({itemsToProceed.length})</a></li>
                    </ul>
                </div>
                <button
                    onClick={() => setNewAgent(true)}
                    className="btn btn-success m-2 float-end"><i className="bi bi-plus-square me-1"></i> Add agent</button>
                <hr />
                {data && (
                    <div className="text-center mb-2 mt-2">
                        <nav aria-label="Page navigation" className="d-inline-block">
                            <ul className="pagination">
                                <li className={"page-item" + (filter.start == "0" ? " disabled" : "")}>
                                    <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                                </li>
                                <li className={"page-item" + ((data.length < 1 || data.length < filter.limit) ? " disabled" : "")}>
                                    <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
                <Table responsive striped bordered hover className={"items-table"}>
                    <thead>
                        <tr>
                            {/* <th className="text-center">
                                <input checked={itemsToProceed.length === data.length} onClick={(e) => toggleAll()} style={{ width: "20px", height: "20px" }} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            </th> */}
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Privileges</th>
                            <th>Routes</th>
                            <th>Created at</th>
                            <th>Updated at</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 && data.map((c, i) => (
                            <tr key={i}>
                                {/* <td className="text-center">
                                    <input checked={itemsToProceed.find(x => x.code === '')}
                                        style={{ width: "20px", height: "20px" }}
                                        onChange={() => handleChange(c)}
                                        className="form-check-input" type="checkbox"
                                        value="" id="flexCheckDefault" />
                                </td> */}
                                <td style={{ fontSize: "18px" }}>{c.id} </td>
                                <td><Link className="text-dark fw-bold" style={{ fontSize: "16px" }} to={`/manage/agent/${c.id}`}>

                                    {c.username}</Link></td>
                                <td>
                                    <div role="button" className="d-inline-block">
                                        {parseInt(c.id) === 1 ? (
                                            <div style={{ fontSize: "11px" }} className="badge bg-danger p-2">Admin</div>
                                        ) : JSON.parse(c.privileges).includes('SUB_ADMIN') ? (
                                            <div style={{ fontSize: "11px" }} className="badge bg-warning text-dark p-2">Sub Admin</div>
                                        ) : (
                                            <div style={{ fontSize: "11px" }} className="badge bg-primary p-2">Agent</div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div
                                        onClick={() => (setPrivilegesModal(true), setSelectedAgent(c))}
                                        role="button" className="btn btn-dark btn-sm">
                                        Privileges
                                    </div>
                                </td>
                                <td>
                                    <div
                                        onClick={() => (setRoutesModal(true), setSelectedAgent(c))}
                                        role="button" className="btn btn-dark btn-sm">
                                        Routes
                                    </div>
                                </td>
                                <td>
                                    <OverlayTrigger
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
                                    </OverlayTrigger>
                                </td>
                                <td>
                                    <OverlayTrigger
                                        placement="auto"
                                        trigger={["focus", "hover"]}
                                        overlay={(
                                            <Popover>
                                                <Popover.Title>
                                                    Time
                                                </Popover.Title>
                                                <Popover.Content>
                                                    <p>{c.updated_at}</p>
                                                </Popover.Content>
                                            </Popover>
                                        )}>
                                        <div role="button">
                                            {moment(c.updated_at).fromNow()}
                                        </div>
                                    </OverlayTrigger>
                                </td>
                                <td>
                                    <div
                                        onClick={() => (setSelectedAgent(c), setUpdateUsernameModal(true))}
                                        className="btn btn-warning text-dark pb-0 pt-0 ps-1 pe-1 me-1" style={{ fontSize: "20px" }}><i className="bi bi-person"></i></div>
                                    <div
                                        onClick={() => (setSelectedAgent(c), setUpdatePasswordModal(true))}
                                        className="btn btn-danger pb-0 pt-0 ps-1 pe-1 me-1" style={{ fontSize: "20px" }}><i className="bi bi-key"></i></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <hr />
                {data && (
                    <div className="text-center mb-2 mt-2">
                        <nav aria-label="Page navigation" className="d-inline-block">
                            <ul className="pagination">
                                <li className={"page-item" + (filter.start == "0" ? " disabled" : "")}>
                                    <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                                </li>
                                <li className={"page-item" + ((data.length < 1 || data.length < filter.limit) ? " disabled" : "")}>
                                    <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
                {allPrivileges && selectedAgent && privilegesModal && (
                    <Modal
                        size="xl"
                        onHide={() => setPrivilegesModal(false)}
                        show={privilegesModal}
                        aria-labelledby="create-route-title"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="create-route-title">Privileges</Modal.Title>
                        </Modal.Header>

                        <Modal.Body align="">
                            <>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        Agent Privileges (click item to remove from user privileges)
                                        <hr />
                                        {JSON.parse(selectedAgent.privileges).length > 0 && JSON.parse(selectedAgent.privileges).sort().map((p, i) => (
                                            <div role="button" className="badge bg-dark me-1 mb-1 float-start" onClick={() => removePrivilege(p)}>{p}</div>
                                        ))}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        All Privileges (click item to add to user privileges)
                                        <hr />
                                        {allPrivileges.length > 0 && allPrivileges.filter(x => !JSON.parse(selectedAgent.privileges).includes(x)).sort().map((p, i) => (
                                            <div role="button" onClick={() => addPrivileges(p)} style={{ backgroundColor: 'grey' }} className="badge me-1 mb-1 float-start">{p}</div>
                                        ))}
                                    </div>
                                </div>

                            </>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                disabled={JSON.stringify(selectedAgent) === JSON.stringify(data.find(x => parseInt(x.id) === parseInt(selectedAgent.id)))}
                                className="btn btn-light"
                                onClick={() => setSelectedAgent(data.find(x => parseInt(x.id) === parseInt(selectedAgent.id)))}>Reset</button>
                            <button
                                onClick={() => handleUpdateStaffPrivilegesRoutes()}
                                disabled={updating}
                                className="btn btn-primary">Save</button>
                        </Modal.Footer>
                    </Modal>
                )}

                {allRoutes && selectedAgent && routesModal && (
                    <Modal
                        size="xl"
                        onHide={() => setRoutesModal(false)}
                        show={routesModal}
                        aria-labelledby="create-route-title"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="create-route-title">Routes</Modal.Title>
                        </Modal.Header>

                        <Modal.Body align="">
                            <>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        Agent routes (click item to remove from user routes)
                                        <hr />
                                        {selectedAgent.routes !== null && JSON.parse(selectedAgent.routes === null ? '[]' : selectedAgent.routes.replace(/'/g, '"')).length > 0 && JSON.parse(selectedAgent.routes === null ? '[]' : selectedAgent.routes.replace(/'/g, '"')).map((r, i) => (
                                            <div
                                                role="button"
                                                onClick={() => removeRouteFromAgent(r)}
                                                style={{ fontSize: "15px" }} className="p-1 bg-light border border-1 rounded border-info shadow-sm me-1 d-inline-block">{flagEmoji(r[0])}<i className="bi bi-arrow-right-short"></i>{flagEmoji(r[1])}</div>
                                        ))}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        All Routes (click item to add to user routes)
                                        <hr />
                                        {allRoutes.length > 0 && allRoutes.filter(x => !JSON.parse(selectedAgent.routes === null ? '[]' : selectedAgent.routes.replace(/'/g, '"')).find(f => f[0] === x.source_country_code && f[1] === x.destination_country_code)).sort().map((r, i) => (
                                            <div style={{ fontSize: "15px" }} role="button" onClick={() => addRouteToAgent(r)} className="p-1 bg-light border border-1 rounded border-info shadow-sm me-1 d-inline-block">{flagEmoji(r.source_country_code)}<i className="bi bi-arrow-right-short"></i>{flagEmoji(r.destination_country_code)}</div>
                                        ))}
                                    </div>
                                </div>

                            </>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                disabled={JSON.stringify(selectedAgent) === JSON.stringify(data.find(x => parseInt(x.id) === parseInt(selectedAgent.id)))}
                                className="btn btn-light"
                                onClick={() => setSelectedAgent(data.find(x => parseInt(x.id) === parseInt(selectedAgent.id)))}>Reset</button>
                            <button
                                onClick={() => handleUpdateStaffPrivilegesRoutes()}
                                disabled={updating}
                                className="btn btn-primary">Save</button>
                        </Modal.Footer>
                    </Modal>
                )}

                {selectedAgent && updatePasswordModal && (
                    <Modal
                        size="md"
                        onHide={() => (setUpdatePasswordModal(false), setPasswordObj({ new_password: "", confirm_password: "" }))}
                        show={updatePasswordModal}
                        aria-labelledby="create-route-title"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="create-route-title">Password</Modal.Title>
                        </Modal.Header>

                        <Modal.Body align="">
                            <>
                                <div className="form-group mb-3">
                                    <label htmlFor="exampleInputPassword">New password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword"
                                        {...register("new_password", { required: true, minLength: 8 })}
                                        onChange={e => {
                                            // setValue(e.target.value);
                                            setPasswordObj({ ...passwordObj, new_password: e.target.value })
                                            trigger();

                                        }
                                        }
                                    />
                                    {errors.password && <p className="text-danger d-block w-full">{errors.new_password?.message}</p>}
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="exampleInputPasswordRepeat">Repeat new password</label>
                                    <input type="password" className="form-control" id="exampleInputPasswordRepeat"
                                        {...register("confirm_password", {
                                            required: true, validate: (val) => {
                                                if (watch('new_password') != val) {
                                                    return "Your passwords do not match";
                                                }
                                            },
                                        })}
                                        onChange={e => {
                                            // setValue(e.target.value);
                                            setPasswordObj({ ...passwordObj, confirm_password: e.target.value })
                                            trigger();

                                        }
                                        }
                                    />
                                    {errors.confirm_password && <p className="text-danger d-block w-full">{errors.confirm_password?.message}</p>}
                                </div>

                            </>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                onClick={() => handleSubmit(handleUpdateStaffPassword)()}
                                disabled={updating}
                                className="btn btn-primary">Save</button>
                        </Modal.Footer>
                    </Modal>
                )}

                {selectedAgent && updateUsernameModal && (
                    <Modal
                        size="md"
                        onHide={() => (setUpdateUsernameModal(false), setUsernameObj({ new_username: "" }), reset2())}
                        show={updateUsernameModal}
                        aria-labelledby="create-route-title"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="create-route-title">Username</Modal.Title>
                        </Modal.Header>

                        <Modal.Body align="">
                            <>
                                <div className="form-group mb-3">
                                    <label htmlFor="exampleInputPassword">New username</label>
                                    <input type="text" className="form-control" id="exampleInputPassword"
                                        {...register2("new_username", { required: true, minLength: 3 })}
                                        onChange={e => {
                                            setUsernameObj({ ...usernameObj, new_username: e.target.value })
                                            trigger2();

                                        }
                                        }
                                    />
                                    {errors2.new_username && <p className="text-danger d-block w-full">Minimum length is 3 characters</p>}
                                </div>

                            </>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                onClick={() => handleSubmit2(handleUpdateStaffUsername)()}
                                disabled={updating}
                                className="btn btn-primary">Save</button>
                        </Modal.Footer>
                    </Modal>
                )}

                {newAgent && (
                    <Modal
                        size="md"
                        onHide={() => (setNewAgent(false), setNewAgentObj({ username: "", password: "", confirm_password: "" }), reset3())}
                        show={newAgent}
                        aria-labelledby="create-route-title"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="create-route-title">New Agent</Modal.Title>
                        </Modal.Header>

                        <Modal.Body align="">
                            <>
                                <div className="form-group mb-3">
                                    <label htmlFor="exampleInputPassword">Username</label>
                                    <input type="text" className="form-control" id="exampleInputPassword"
                                        {...register3("username", { required: true, minLength: 3 })}
                                        onChange={e => {
                                            setNewAgentObj({ ...newAgentObj, username: e.target.value })
                                            trigger3();

                                        }
                                        }
                                    />
                                    {errors3.username && <p className="text-danger d-block w-full">Minimum length must be 3 characters</p>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="exampleInputPassword">Password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword"
                                        {...register3("password", { required: true, minLength: 8 })}
                                        onChange={e => {
                                            // setValue(e.target.value);
                                            setNewAgentObj({ ...newAgentObj, password: e.target.value })
                                            trigger3();

                                        }
                                        }
                                    />
                                    {errors3.password && <p className="text-danger d-block w-full">{errors3.password?.message}</p>}
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="exampleInputPasswordRepeat">Repeat password</label>
                                    <input type="password" className="form-control" id="exampleInputPasswordRepeat"
                                        {...register3("confirm_password", {
                                            required: true, validate: (val) => {
                                                if (watch3('password') != val) {
                                                    return "Your passwords do not match";
                                                }
                                            },
                                        })}
                                        onChange={e => {
                                            // setValue(e.target.value);
                                            setNewAgentObj({ ...newAgentObj, confirm_password: e.target.value })
                                            trigger3();

                                        }
                                        }
                                    />
                                    {errors3.confirm_password && <p className="text-danger d-block w-full">{errors3.confirm_password?.message}</p>}
                                </div>

                            </>
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                onClick={() => handleSubmit3(handleNewAgent)()}
                                disabled={updating}
                                className="btn btn-primary">Save</button>
                        </Modal.Footer>
                    </Modal>
                )}

            </div>
        </>
    );
};

export default PrivateAgents;