import { Spinner } from "react-bootstrap";
import { percentageTwoNumber } from "utils/functions";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Periods({ periods, loading }) {

    const [options, setOptions] = useState(null);
    console.log(periods);
    return (
        <div className="card border-0 shadow">
            <div className="card-header">
                <div className="row align-items-center">
                    <div className="col">
                        <h2 className="fs-5 fw-bold mb-0">Average days parcel took to arrive after shipping</h2>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                        <tr>
                            <th className="border-bottom" scope="col">Route</th>
                            <th className="border-bottom" scope="col">Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(loading || !periods) ? (
                            <Spinner />
                        ) : (
                            <>
                                {periods.map((period, i) => (
                                    <tr key={i}>
                                        <td className="text-gray-900" scope="row">{period.source_country_code}/{period.destination_country_code}</td>
                                        <td className="fw-bolder text-gray-500">
                                            {Intl.NumberFormat('en').format(period.average_time_in_days)}
                                        </td>
                                    </tr>

                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Periods;