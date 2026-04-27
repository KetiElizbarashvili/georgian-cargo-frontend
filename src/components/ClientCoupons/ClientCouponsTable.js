import { useRequest } from "hooks";
import { useEffect, useState } from "react";
import clientCoupons from "requests/clientCoupons";
import moment from "moment";
import { Link } from "react-router-dom";

const ClientCouponsTable = () => {
    const [getClientCouponsReq] = useRequest(clientCoupons);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ start: 0, limit: 5 });

    useEffect(() => {
        getClientCouponsReq({ start: filter.start, limit: filter.limit })
            .then((response) => {
                setData(response.data.coupons);
            });
    }, [filter.start]);

    const handleNext = () => {
        setFilter({ ...filter, start: (parseInt(filter.start) + filter.limit) });
    };

    const handlePrev = () => {
        let strt = parseInt(filter.start) < filter.limit ? 0 : parseInt(filter.start) - filter.limit;
        setFilter({ ...filter, start: strt });
    };


    return (
        <>


            <div className="alert bg-warning"><i className="bi bi-info-circle me-1"></i>To use coupon, copy code and apply in <Link to="/dashboard/cargos">parcels page</Link>.</div>
            {data && data.length > 0 && data.map((c, i) => (
                <div className='ticket'>
                    <div className='ticket-edge-top-left'></div>
                    <div className='ticket-edge-top-right'></div>
                    <div className='ticket-edge-bottom-left'></div>
                    <div className='ticket-edge-bottom-right'></div>
                    <div className='ticket-punches'></div>
                    <div className='ticket-punches-right'></div>
                    <div className='ticket-inner'>
                        <div className='ticket-headline'>
                            {c.code}
                        </div>
                        <div className='ticket-star'>
                            <div className='fa fa-star-o'></div>
                        </div>
                        <div className='ticket-admit'>
                            <span className='char'>Discount: {JSON.parse(c.metadata).percent}</span>
                        </div>
                        <div className='ticket-numbers'>COUPON</div>
                        <div className='ticket-numbers second'>{
                            moment(c.created_at).format(
                                "D MMMM YYYY"
                            )
                        }</div>
                    </div>
                </div>
            ))}
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
        </>
    );
};

export default ClientCouponsTable;