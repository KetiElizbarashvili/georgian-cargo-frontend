import { useRequest } from "hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import getLoyaltyPoints from "requests/getLoyaltyPoibts";
import saveLoyaltySettings from "requests/saveLoyaltySettings";
import { toast } from "react-toastify";
import { loyaltyActivity } from "requests/loyaltyActivity";
import LoyaltyActivityTable from "./LoyaltyActivityTable";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const AdminLoyalty = () => {
    const { register, setValue, trigger, control, handleSubmit, formState: { errors } } = useForm();
    const [getLoyaltyPointsReq] = useRequest(getLoyaltyPoints);
    const [saveLoyaltySettingsReq] = useRequest(saveLoyaltySettings);
    const [loyaltyActivityReq] = useRequest(loyaltyActivity);

    const [rates, setRates] = useState(null);
    const [points, setPoints] = useState([]);
    const [activity, setActivity] = useState([]);
    const [activityFilter, setActivityFilter] = useState({
        start: 0,
        limit: 10
    });

    const handleNext = () => {
        setActivityFilter({ ...activityFilter, start: (parseInt(activityFilter.start) + parseInt(activityFilter.limit)) });
    };

    const handlePrev = () => {
        let start = parseInt(activityFilter.start) < parseInt(activityFilter.limit) ? 0 : parseInt(activityFilter.start) - parseInt(activityFilter.limit);
        setActivityFilter({ ...activityFilter, start: start.toString() });
    };

    useEffect(() => {
        loadPoints();
    }, []);

    useEffect(() => {
        loadActivity();
    }, [activityFilter]);

    const loadActivity = () => {
        loyaltyActivityReq({ start: activityFilter.start, limit: activityFilter.limit })
            .then(response => {
                setActivity(response.data.activity);
            });
    };

    const saveSettings = () => {
        saveLoyaltySettingsReq({
            SHARE_LINK: points.find(x => x.type === 'SHARE_LINK').value,
            INVITE_CUSTOMER: points.find(x => x.type === 'INVITE_CUSTOMER').value,
            INVITED_CUSTOMER_USED_SERVICE: points.find(x => x.type === 'INVITED_CUSTOMER_USED_SERVICE').value,
            value: rates.value,
            percentage: rates.percentage
        })
            .then(response => {
                toast.success("Settings saved!", toastOptions);
                loadPoints();
            });
    };

    const loadPoints = () => {
        getLoyaltyPointsReq()
            .then(response => {
                console.log(response.data);
                setPoints(response.data.points);
                setRates(response.data.rates);
            });
    };


    return points && rates && (
        <div className="row pt-4 bg-white">
            <div className="col-12 col-md-8">
                {activity && activity.length > 0 ? (
                    <>
                        <LoyaltyActivityTable activity={activity} />
                        <button className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#allLoyaltyActivity">View all</button>

                    </>
                ) : (
                    "No activity found"
                )}
            </div>
            <div className="col-12 col-md-4 alert">
                <h4>Loyalty Settings</h4>
                {points.map(point => (
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Points for {point.type}</label>
                        <input type="text"
                            onChange={(e) => setPoints(points.map(x => {
                                if (x.type === point.type) {
                                    x.value = e.target.value;
                                    return x;
                                }
                                return x;
                            }))}
                            name={point.type} value={point.value} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    </div>
                ))}

                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Value of One Point</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setRates({ ...rates, value: e.target.value })}
                        value={rates.value} id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>

                <div className="mb-3">
                    <label for="exampleInputEmail1"
                        className="form-label">Cashback Percentage of Freight Price</label>
                    <input onChange={(e) => setRates({ ...rates, percentage: e.target.value })} type="text" className="form-control" value={rates.percentage} id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>

                <button onClick={() => saveSettings()} className="btn btn-primary float-end">Save</button>
            </div>

            <div class="modal fade" id="allLoyaltyActivity" tabindex="-1" aria-labelledby="allLoyaltyActivityLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="allLoyaltyActivityLabel">All loyalty activity</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            {activityFilter && activity && (
                                <div className="text-center mb-2">
                                    <nav aria-label="Page navigation" className="d-inline-block">
                                        <ul className="pagination">
                                            <li className={"page-item"}>
                                                <a className={"btn btn-primary p-2 " + (activityFilter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                                            </li>
                                            <li className="page-item">
                                                <a className={"btn btn-primary p-2 " + ((activity.length < activityFilter.limit || activity.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}

                            <LoyaltyActivityTable activity={activity} />

                            {activityFilter && activity && (
                                <div className="text-center mb-2">
                                    <nav aria-label="Page navigation" className="d-inline-block">
                                        <ul className="pagination">
                                            <li className={"page-item"}>
                                                <a className={"btn btn-primary p-2 " + (activityFilter.start == "0" ? " disabled" : "")} onClick={handlePrev} aria-label="Previous">Prev</a>
                                            </li>
                                            <li className="page-item">
                                                <a className={"btn btn-primary p-2 " + ((activity.length < activityFilter.limit || activity.length === 0) ? " disabled" : "")} onClick={handleNext} aria-label="Next">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );

};

export default AdminLoyalty;