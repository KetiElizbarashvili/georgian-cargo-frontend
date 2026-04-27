import { Col, Row, Button, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import NewCouponsModal from "components/NewCouponsModal"
import getCoupons from "requests/getCoupons";
import deleteCoupons from "requests/deleteCoupons";
import giveCoupons from "requests/giveCoupons";
import { useEffect, useState } from "react";
import { useRequest } from "hooks";
import moment from "moment";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const PrivateCouponsTable = () => {
    const [getCouponsReq] = useRequest(getCoupons);
    const [deleteCouponsReq] = useRequest(deleteCoupons);
    const [giveCouponsReq] = useRequest(giveCoupons);
    const [itemsToProceed, setItemsToProceed] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [givening, setGivening] = useState(false);
    const [handlingGiven, setHandlingGiven] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [data, setData] = useState([]);
    const [givenData, setGivenData] = useState({
        note: "",
        email: ""
    });
    const [filter, setFilter] = useState({
        start: 0,
        limit: 15,
        query: ""
    });
    useEffect(() => {
        handleGetCoupons();
    }, [filter]);


    const handleGiven = () => {
        setHandlingGiven(true);
        giveCouponsReq({ ids: itemsToProceed.map(x => x.code), note: givenData.note, email: givenData.email })
            .then((response) => {
                let cpns = [...data];
                // console.log(response.data.coupons); return;
                setData(cpns.map(x => {
                    let tmp = response.data.coupons.find(y => y.code === x.code)
                    if (tmp) {
                        return tmp;
                    } else {
                        return x;
                    }
                }));
                setGivening(false);
                setHandlingGiven(false);
                setItemsToProceed([]);
                toast.success("Saved!", toastOptions);
            })
    };

    const handleDeleteCoupons = () => {
        let con = window.confirm(`You sure want to delete ${itemsToProceed.length} coupons?`);
        if (con) {
            deleteCouponsReq({ ids: itemsToProceed.map(x => x.code), start: filter.start, query: filter.query, limit: filter.limit })
                .then((response) => {
                    if (!response.data.error) {
                        setData(response.data.coupons ?? []);
                        toast.success("Deleted successfully!", toastOptions);
                        setItemsToProceed([]);
                    } else {
                        toast.success("Not deleted!", toastOptions)
                    }
                });
        }
    };

    const handleChange = (c) => {
        let itms = [...itemsToProceed];
        if (itms.find(x => x.code === c.code)) {
            itms = itms.filter(x => x.code !== c.code);
        } else {
            itms.push(c);
        }
        setItemsToProceed(itms);
    };
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

    const handleGetCoupons = () => {
        getCouponsReq(filter)
            .then((response) => {
                setData(response.data.coupons);
            });
    };
    return (
        <div className="bg-white">
            <div className="btn-group float-start m-2" role="group" aria-label="Basic example">
                <button type="button" className={"btn " + (filter.limit === 15 ? 'btn-light' : 'btn-info')} onClick={() => setFilter({ ...filter, limit: 15 })}>15</button>
                <button type="button" className={"btn " + (filter.limit === 50 ? 'btn-light' : 'btn-info')} onClick={() => setFilter({ ...filter, limit: 50 })}>50</button>
                <button type="button" className={"btn " + (filter.limit === 100 ? 'btn-light' : 'btn-info')} onClick={() => setFilter({ ...filter, limit: 100 })}>100</button>
            </div>
            <div className="dropdown float-start m-2">
                <button disabled={itemsToProceed.length < 1} className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Actions
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item rounded-0"
                        role="button"
                        onClick={() => setGivening(true)}>Mark as given ({itemsToProceed.length})</a></li>
                    {/* <li><a className="dropdown-item rounded-0"
                        role="button"
                        onClick={() => setGivening(true)}>Download CSV ({itemsToProceed.length})</a></li> */}
                    <li><a
                        className="dropdown-item bg-danger text-white rounded-0"
                        role="button"
                        onClick={() => handleDeleteCoupons()}>Delete ({itemsToProceed.length})</a></li>
                </ul>
            </div>
            <button
                onClick={() => setGenerating(true)}
                className="btn btn-success m-2 float-end"><i className="bi bi-plus-square me-1"></i> Generate</button>
            <hr />
            {data && (
                <div className="text-center mb-2 mt-2">
                    <nav aria-label="Page navigation" className="d-inline-block">
                        <ul className="pagination">
                            <li className={"page-item" + (filter.start == "0" ? " disabled" : "")}>
                                <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
                            </li>
                            <li className={"page-item" + ((data.length < 1) ? " disabled" : "")}>
                                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
            <Table responsive striped bordered hover className={"items-table"}>
                <thead>
                    <tr>
                        <th className="text-center">
                            <input checked={itemsToProceed.length === data.length} onClick={(e) => toggleAll()} style={{ width: "20px", height: "20px" }} className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        </th>
                        <th>Code</th>
                        <th>Amount</th>
                        <th>Generated by</th>
                        <th>Given status</th>
                        <th>Created at</th>
                        <th>Given at</th>
                        <th>Expires in</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 && data.map((c, i) => (
                        <tr key={i}>
                            <td className="text-center">
                                <input checked={itemsToProceed.find(x => x.code === c.code)}
                                    style={{ width: "20px", height: "20px" }}
                                    onChange={() => handleChange(c)}
                                    className="form-check-input" type="checkbox"
                                    value="" id="flexCheckDefault" />
                            </td>
                            <td className={c.given ? '' : 'table-warning'} style={{ fontSize: "18px" }}>{c.code} <i onClick={() => (copy(c.code, toast.success("Copied to clipboard!", toastOptions)))}><i className="bi bi-subtract ms-2 text-info" role="button"></i></i></td>
                            <td>{JSON.parse(c.metadata).percent}</td>
                            <td>{JSON.parse(c.metadata).from !== undefined ? (
                                <>
                                    {JSON.parse(c.metadata).from}{': '}<Link to={`/manage/agent/${JSON.parse(c.metadata).id}`}>{JSON.parse(c.metadata).username}</Link>
                                </>
                            ) : (
                                'unknown'
                            )}</td>
                            <td>{c.given ? (
                                <>
                                    <i style={{ fontSize: "16px" }} className="text-success bi bi-check-square-fill me-1"></i>

                                    <OverlayTrigger
                                        placement="auto"
                                        trigger={["focus", "hover"]}
                                        overlay={(
                                            <Popover>
                                                <Popover.Title>
                                                    Given info
                                                </Popover.Title>
                                                <Popover.Content>
                                                    {c.email !== null && (
                                                        <p>email: {c.email}</p>
                                                    )}
                                                    {c.note !== null && (
                                                        <p>note: {c.note}</p>
                                                    )}
                                                </Popover.Content>
                                            </Popover>
                                        )}>
                                        <i style={{ fontSize: "16px" }} role="button" className="text-warning bi bi-card-text me-1 ms-1"></i>
                                    </OverlayTrigger>

                                </>
                            ) : (
                                <i style={{ fontSize: "16px" }} className="text-danger bi bi-x-square-fill"></i>
                            )}</td>
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
                                {c.given_at && (
                                    <OverlayTrigger
                                        placement="auto"
                                        trigger={["focus", "hover"]}
                                        overlay={(
                                            <Popover>
                                                <Popover.Title>
                                                    Time
                                                </Popover.Title>
                                                <Popover.Content>
                                                    <p>{c.given_at}</p>
                                                </Popover.Content>
                                            </Popover>
                                        )}>
                                        <div role="button">
                                            {moment(c.given_at).fromNow()}
                                        </div>
                                    </OverlayTrigger>
                                )}
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
                                                <p>{c.expires_at}</p>
                                            </Popover.Content>
                                        </Popover>
                                    )}>
                                    <div role="button">
                                        {c.created_at > c.expires_at ? (
                                            <p className="text-danger">Expired</p>
                                        ) : (
                                            moment(c.expires_at).fromNow()
                                        )}
                                    </div>
                                </OverlayTrigger>
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
                            <li className={"page-item" + ((data.length < 1) ? " disabled" : "")}>
                                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
            <NewCouponsModal
                show={generating}
                setShow={setGenerating}
                setCoupons={setData}
                coupons={data}
                limit={filter.limit} />

            <Modal
                size="md"
                onHide={() => setGivening(false)}
                show={givening}
                aria-labelledby="create-route-title"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="create-route-title">Mark as given</Modal.Title>
                </Modal.Header>

                <Modal.Body align="">
                    <>
                        {itemsToProceed && itemsToProceed.length > 0 && itemsToProceed.map((it, i) => (
                            <div className="badge bg-warning m-1">{it.code}</div>
                        ))}
                        <hr />
                        <small className="text-muted">To gift coupon to client enter their email address (optional)</small>
                        <div className="form-floating mb-2">
                            <input
                                value={givenData.email}
                                onChange={(e) => setGivenData({ ...givenData, email: e.target.value })}
                                type="email" name="email" className="form-control position-relative" id="floatingInput" placeholder="" />
                            <label for="floatingInput">Client Email</label>
                        </div>
                        <small className="text-muted">Enter note For all coupons. for example: these coupons i gave to our followers on facebook (optional)</small>
                        <div className="form-floating mb-2">
                            <input
                                value={givenData.note}
                                onChange={(e) => setGivenData({ ...givenData, note: e.target.value })}
                                type="text" name="count" className="form-control position-relative" id="floatingInput" placeholder="" />
                            <label for="floatingInput">Note</label>
                        </div>
                        <button
                            disabled={handlingGiven}
                            className="btn btn-primary float-end" onClick={() => handleGiven()} >
                            {handlingGiven ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default PrivateCouponsTable;