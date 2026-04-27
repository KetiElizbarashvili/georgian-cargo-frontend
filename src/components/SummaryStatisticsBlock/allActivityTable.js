import { Spinner } from "react-bootstrap";
import { currency_symbols } from "utils/Currency";
import moment from "moment";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRequest } from "hooks";
import { allActivity } from "requests/allActivity";

const initFilter = { start: 0, limit: 13 };


function AllActivityTable() {
    const [getAllActivity] = useRequest(allActivity);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(initFilter);

    useEffect(() => {
        setLoading(true);
        getAllActivity(filter)
            .then((response) => {
                setData(response.data.activity);
                setLoading(false);
            });
    }, [filter]);

    const handleNext = () => {
        setFilter({ ...filter, start: (parseInt(filter.start) + parseInt(filter.limit)) });
    };

    const handlePrev = () => {
        let start = parseInt(filter.start) < parseInt(filter.limit) ? 0 : parseInt(filter.start) - parseInt(filter.limit);
        setFilter({ ...filter, start: start.toString() });
    };

    return (
        <>
            {filter && data && (
                <div className="text-center mb-2">
                    <nav aria-label="Page navigation" className="d-inline-block">
                        <ul className="pagination">
                            <li className={"page-item"}>
                                <a className={"btn btn-primary p-2 " + (filter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                            </li>
                            <li className="page-item">
                                <a className={"btn btn-primary p-2 " + ((data.length < filter.limit || data.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
            <div className="table-responsive">
                <table className="table table-borderless align-items-center table-flush">
                    <thead className="thead-light">
                        <tr>
                            <th className="border-bottom" scope="col">Id</th>
                            <th className="border-bottom" scope="col">Type</th>
                            <th className="border-bottom" scope="col">Description</th>
                            <th className="border-bottom" scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(loading || !data) ? (
                            <Spinner />
                        ) : (
                            data.map((act, i) => (
                                <tr key={act.id}>
                                    <th className="text-gray-900" scope="row">{act.id}</th>
                                    <td className="text-gray-300">
                                        {act.type === 'REGISTER' && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-person-fill"></i>
                                            </>
                                        )}
                                        {act.type === 'BOOKING' && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-card-list"></i>
                                            </>
                                        )}
                                        {act.type === 'PAYMENT' && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-currency-exchange"></i>
                                            </>
                                        )}
                                        {act.type === 'HANDLE' && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-box-seam-fill"></i>
                                            </>
                                        )}
                                        {act.type === 'COUPONSTAFF' && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-ticket-perforated"></i>
                                            </>
                                        )}
                                        {(act.type === 'BOOKNOTE' || act.type === 'CARGONOTE') && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-sticky"></i>
                                            </>
                                        )}
                                        {(act.type === 'BOOKHANDLE') && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-person-check"></i>
                                            </>
                                        )}
                                        {(act.type === 'BOOKCANCEL') && (
                                            <>
                                                <i style={{ fontSize: "20px" }} className="bi bi-calendar-x"></i>
                                            </>
                                        )}
                                    </td>
                                    <td className="text-gray-300">
                                        {act.type === 'COUPONSTAFF' && (
                                            <>
                                                <b><Link to={`/manage/client/${JSON.parse(act.data).staff_id}`}>{JSON.parse(act.data).staff}</Link></b> has generated {JSON.parse(act.data).total} <a href="/manage/coupons">coupons</a>
                                            </>
                                        )}

                                        {act.type === 'BOOKING' && (
                                            <>
                                                <b><Link to={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).customer_name}</Link></b> has created booking
                                            </>
                                        )}
                                        {act.type === 'REGISTER' && (
                                            <>
                                                <b><Link to={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).name}</Link></b> has registered on website
                                            </>
                                        )}
                                        {act.type === 'PAYMENT' && (
                                            <>
                                                <b><Link to={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).customer_name}</Link></b>
                                                {' has paid '}
                                                <b>{currency_symbols(JSON.parse(act.data).currency) + JSON.parse(act.data).amount.toFixed(2)}</b>
                                                {' with '}
                                                <b>
                                                    {JSON.parse(act.data).method.toLowerCase()}
                                                </b>
                                                {' for parcel: '}
                                                <b><Link to={`/manage/item/${JSON.parse(act.data).tracking}`}>{JSON.parse(act.data).tracking}</Link></b>
                                            </>
                                        )}
                                        {act.type === 'HANDLE' && (
                                            <>
                                                <b>{JSON.parse(act.data).staff}</b>
                                                {' has changed status on parcel: '}
                                                <b><Link to={`/manage/item/${JSON.parse(act.data).tracking}`}>{JSON.parse(act.data).tracking}</Link></b>
                                                {' to '}
                                                <b>{JSON.parse(act.data).type}</b>
                                            </>
                                        )}
                                        {act.type === 'BOOKNOTE' && (
                                            <>
                                                {JSON.parse(act.data).target === 'staff' ? (
                                                    <a href={`/manage/agent/${JSON.parse(act.data).id}`}>{JSON.parse(act.data).username}</a>
                                                ) : (
                                                    <a href={`/manage/client/${JSON.parse(act.data).id}`}>{JSON.parse(act.data).username}</a>
                                                )}
                                                {' has left note on booking '}
                                                <div className="badge bg-success">{JSON.parse(act.data).book_id}</div>

                                            </>
                                        )}
                                        {act.type === 'CARGONOTE' && (
                                            <>
                                                {JSON.parse(act.data).target === 'staff' ? (
                                                    <a href={`/manage/agent/${JSON.parse(act.data).id}`}>{JSON.parse(act.data).username}</a>
                                                ) : (
                                                    <a href={`/manage/client/${JSON.parse(act.data).id}`}>{JSON.parse(act.data).username}</a>
                                                )}
                                                {' has left note on parcel '}
                                                <b><Link to={`/manage/item/${JSON.parse(act.data).tracking}`}>{JSON.parse(act.data).tracking}</Link></b>

                                            </>
                                        )}
                                        {(act.type === 'BOOKHANDLE') && (
                                            <>
                                                <b>
                                                    <a href={`/manage/agent/${JSON.parse(act.data).id}`}>{JSON.parse(act.data).username}</a>
                                                </b>
                                                {' has handled book '}
                                                <div className="badge bg-success">{JSON.parse(act.data).booking_id}</div>
                                            </>
                                        )}
                                        {(act.type === 'BOOKCANCEL') && (
                                            <>
                                                {'Book '}
                                                <div className="badge bg-success">{JSON.parse(act.data).booking_id}</div>
                                                {' was canceled. '}
                                            </>
                                        )}
                                    </td>
                                    <td
                                        title={moment(act.created_at).format(
                                            "D MMMM, YYYY, h:mm:ss a"
                                        )}
                                        className="fw-bolder text-gray-500">
                                        {
                                            moment(act.created_at).fromNow()
                                        }
                                    </td>
                                </tr>

                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {filter && data && (
                <div className="text-center mb-2">
                    <nav aria-label="Page navigation" className="d-inline-block">
                        <ul className="pagination">
                            <li className={"page-item"}>
                                <a className={"btn btn-primary p-2 " + (filter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                            </li>
                            <li className="page-item">
                                <a className={"btn btn-primary p-2 " + ((data.length < filter.limit || data.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </>
    );
}

export default AllActivityTable;