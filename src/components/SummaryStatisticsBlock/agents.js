import { Spinner } from "react-bootstrap";
import { percentageTwoNumber } from "utils/functions";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Agents({ agents, loading }) {

    const [options, setOptions] = useState(null);
    const setAgentsData = () => {
        console.log(agents);
        var opts = {
            series: agents.map(a => a.total),
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: agents.map(a => a.username),
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        setOptions(opts);
    };

    useEffect(() => {
        setAgentsData();
    }, []);

    return (
        <div className="card border-0 shadow">
            <div className="card-header">
                <div className="row align-items-center">
                    <div className="col">
                        <h2 className="fs-5 fw-bold mb-0">Agents</h2>
                        {options && (
                            <Chart
                                options={options}
                                series={options.series}
                                type="pie"
                                height="350"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                        <tr>
                            <th className="border-bottom" scope="col">Username</th>
                            <th className="border-bottom" scope="col">Total Events</th>
                            <th className="border-bottom" scope="col">Current Period</th>
                            <th className="border-bottom" scope="col">Compared to last period</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(loading || !agents) ? (
                            <Spinner />
                        ) : (
                            <>
                                {agents.map((agent, i) => (
                                    <tr key={i}>
                                        <td className="text-gray-900" scope="row"><Link to={`/manage/agent/${agent.id}`}>{agent.username}</Link></td>
                                        <td className="fw-bolder text-gray-500">
                                            {Intl.NumberFormat('en').format(agent.total)}
                                        </td>
                                        <td className="fw-bolder text-gray-500">
                                            {Intl.NumberFormat('en').format(agent.current_month)}
                                        </td>
                                        <td className="fw-bolder text-gray-500">
                                            <div className="d-flex">
                                                <i className={"bi " + (agent.current_month > agent.previous_month ? 'bi-arrow-up text-success' : 'bi-arrow-down text-danger')}></i>
                                                <div><span className={"fw-bolder me-1 " + (agent.current_month > agent.previous_month ? 'text-success' : 'text-danger')}>
                                                    {percentageTwoNumber(agent.current_month, agent.previous_month)}%
                                                </span>
                                                </div>
                                            </div>
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

export default Agents;