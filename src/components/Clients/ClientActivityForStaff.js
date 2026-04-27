import { Spinner } from "react-bootstrap";
import useRequest from "../../hooks/useRequest";
import clientActivityReq from "requests/clientActivity";
import { useParams, Link } from 'react-router-dom';
import moment from "moment";
import { currency_symbols } from "utils/Currency";
import { useEffect, useState } from "react";

const initFilter = { start: 0, id: null, limit: 10 };

function ClientActivityForStaff() {
    const [getClientActivity] = useRequest(clientActivityReq);
    const [activity, setActivity] = useState([]);
    const params = useParams()
    const [filter, setFilter] = useState({ ...initFilter, id: params.id });

    useEffect(() => {
        getClientActivity(filter)
            .then((response) => {
                console.log(response.data.customer.activity);
                setActivity(response.data.customer.activity);
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
            {filter && (
                <div className="text-center mb-2">
                    <nav aria-label="Page navigation" className="d-inline-block">
                        <ul className="pagination">
                            <li className={"page-item"}>
                                <a className={"btn btn-primary p-2 " + (filter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                            </li>
                            <li className="page-item">
                                <a className={"btn btn-primary p-2 " + ((activity.length < filter.limit || activity.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
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
                        {(!activity) ? (
                            <Spinner />
                        ) : (
                            activity.map((act, i) => (
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
                                    </td>
                                    <td className="text-gray-300">
                                        {act.type === 'BOOKING' && (
                                            <>
                                                <b><a href={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).customer_name}</a></b> has created booking
                                            </>
                                        )}
                                        {act.type === 'REGISTER' && (
                                            <>
                                                <b><a href={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).name}</a></b> has registered on website
                                            </>
                                        )}
                                        {act.type === 'PAYMENT' && (
                                            <>
                                                <b><a href={`/manage/client/${JSON.parse(act.data).customer_id}`}>{JSON.parse(act.data).customer_name}</a></b>
                                                {' has paid '}
                                                <b>{currency_symbols(JSON.parse(act.data).currency) + parseFloat(JSON.parse(act.data).amount).toFixed(2)
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                                                {' with '}
                                                <b>
                                                    {JSON.parse(act.data).method.toLowerCase()}
                                                </b>
                                                {' for parcel: '}
                                                <b><a href={`/manage/item/${JSON.parse(act.data).tracking}`} >{JSON.parse(act.data).tracking}</a></b>
                                            </>
                                        )}
                                        {act.type === 'HANDLE' && (
                                            <>
                                                <b>{JSON.parse(act.data).staff}</b>
                                                {' has changed status on parcel: '}
                                                <b><a href={`/manage/item/${JSON.parse(act.data).tracking}`} >{JSON.parse(act.data).tracking}</a></b>
                                                {' to '}
                                                <b>{JSON.parse(act.data).type}</b>
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
            {filter && (
                <div className="text-center mb-2">
                    <nav aria-label="Page navigation" className="d-inline-block">
                        <ul className="pagination">
                            <li className={"page-item"}>
                                <a className={"btn btn-primary p-2 " + (filter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                            </li>
                            <li className="page-item">
                                <a className={"btn btn-primary p-2 " + ((activity.length < filter.limit || activity.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </>
    );
}

export default ClientActivityForStaff;