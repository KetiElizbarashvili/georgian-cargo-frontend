import { useContext, useEffect, useState } from "react";
import { currency_symbols } from 'utils/Currency';
import { useRequest } from "hooks";
import { Col, Row, Spinner } from "react-bootstrap";
import SummaryStatisticsBlock from "components/SummaryStatisticsBlock";
import ActivityBlock from "components/SummaryStatisticsBlock/activity";
import GetAgentsRequest from "routes/GetAgentsRequest";
import { Button, ButtonGroup } from "react-bootstrap";
import { AuthContext } from "context";
import CargoStatisticsTable from "components/CargoStatisticsTable/CargoStatisticsTable";
import cargoStatisticsRequest from "requests/cargoStatistics.js";
import { percentageTwoNumber } from "utils/functions";
import Agents from "components/SummaryStatisticsBlock/agents";
import ClientsChart from "components/ClientsChart";
import WeightChart from "components/WeightChart";
import FreightChart from "components/FreightChart";
import Periods from "components/SummaryStatisticsBlock/periods";


const initFilter = { status: "", agent: "", route: "", datefrom: "", dateto: "", paymentmethod: "", paymentstatus: "", collection: "", interval: "month" };


export const PrivateSummary = () => {
    const { auth } = useContext(AuthContext);
    const isAdmin = auth.accountType === "ADMIN" && auth.accountId === "1";
    const isSubAdmin = auth.staff.privileges.includes('SUB_ADMIN');
    const viewActivity = auth.staff.privileges.includes('VIEW_ACTIVITY');
    const viewCargoStatistics = auth.staff.privileges.includes('VIEW_CARGO_STATISTICS');
    const viewPricesStatisticsDetails = auth.staff.privileges.includes('VIEW_PRICES_STATISTICS_DETAILS');
    const viewAgentStatistics = auth.staff.privileges.includes('VIEW_AGENT_STATISTICS');

    const viewTotalPrice = auth.staff.privileges.includes('SUMMARY_TOTAL_PRICE');
    const viewClientsRegistered = auth.staff.privileges.includes('SUMMARY_CLIENTS_REGISTERED');
    const viewNewClients = auth.staff.privileges.includes('SUMMARY_NEW_CLIENTS');
    const viewClientsUsedService = auth.staff.privileges.includes('SUMMARY_CLIENTS_USED_SERVICE');
    const viewItems = auth.staff.privileges.includes('SUMMARY_ITEMS');
    const viewBookings = auth.staff.privileges.includes('SUMMARY_BOOKINGS');
    const viewUnpaid = auth.staff.privileges.includes('SUMMARY_UNPAID');

    const viewFreight = auth.staff.privileges.includes('SUMMARY_FREIGHT');
    const viewPackaging = auth.staff.privileges.includes('SUMMARY_PACKAGING');
    const viewDelivery = auth.staff.privileges.includes('SUMMARY_DELIVERY');
    const viewExtraCharges = auth.staff.privileges.includes('SUMMARY_EXTRA_CHARGES');
    const viewDiscount = auth.staff.privileges.includes('SUMMARY_DISCOUNT');
    const viewWeight = auth.staff.privileges.includes('SUMMARY_WEIGHT');


    const [getCargoStatistics] = useRequest(cargoStatisticsRequest);
    const [filter, setFilter] = useState(initFilter);
    const [getAgents,] = useRequest(GetAgentsRequest);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null)
    const [agents, setAgents] = useState([]);
    const [statisticsData, setStatisticsData] = useState([]);
    const { auth: { routes, accountType, accountId } } = useContext(AuthContext);

    useEffect(() => {
        console.log(statisticsData);
    }, [statisticsData]);

    useEffect(() => {
        loadAgents();
        getCargoStatisticsHandler();
    }, []);

    useEffect(() => {
        if (filter === initFilter) {
            getCargoStatisticsHandler();
        }
        // getCargoStatisticsHandler();
    }, [filter]);

    const getCargoStatisticsHandler = () => {
        setLoading(true);
        // console.log("started loading");
        getCargoStatistics({ ...filter })
            .then((response) => {
                // console.log(response.data);
                setSummary({
                    activity: response.data.activity,
                    agents: response.data.agents,
                    bookings: response.data.bookings,
                    customers: response.data.customers,
                    customersUsed: response.data.customersUsed,
                    unverifiedCustomers: response.data.unverifiedCustomers,
                    parcels: response.data.parcels,
                    prices: response.data.prices,
                    pricesParts: response.data.pricesParts,
                    unpaid: response.data.unpaid,
                    periods: response.data.periods,

                });
                setStatisticsData(response.data.data.sort((a, b) => {
                    if (a.year !== b.year) {
                        return a.year - b.year;
                    } else if (a.month !== b.month) {
                        return a.month - b.month;
                    } else if (a.week !== b.week) {
                        return a.week - b.week;
                    } else {
                        return a.day - b.day;
                    }
                }));

                setLoading(false);
            })
            .catch((e) => console.error(e, 999));
    };


    const updateFilter = ({ key, value }) => {
        if (value) {
            setFilter((prev) => ({ ...prev, [key]: value }));
        } else {
            setFilter((prev) => {
                const { [key]: _, ...newFilter } = prev;
                return newFilter;
            });
        }
    }

    const loadAgents = () => {
        setAgents([]);
        getAgents().then(({ data }) => {
            setAgents(data.agents);
        }).catch((e) => { });
    }


    const handleFilter = () => {
        setFilter(filter);
        getCargoStatisticsHandler();
    };

    const resetFilter = () => {
        setFilter(initFilter);
    };


    return (
        <>
            <Row className={"mb-3"}>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="paymentFilter">Payment status</label>
                    <select className={"form-control"} id="paymentFilter"
                        value={filter.paymentstatus}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'paymentstatus', value }) }}>
                        <option value="">All</option>
                        <option value="PAID">Paid</option>
                        <option value="PENDING">Not Paid</option>
                    </select>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="paymentMethodFilter">Payment method</label>
                    <select className={"form-control"} id="paymentMethodFilter"
                        value={filter.paymentmethod}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'paymentmethod', value }) }}>
                        <option value="">All</option>
                        <option value="STRIPE">Stripe</option>
                        <option value="CASH">Cash</option>
                        <option value="BANK">Bank</option>
                        <option value="CARD">Card</option>
                    </select>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="dateFrom">Date from:</label>
                    <input type={"date"} id="datefrom" className={"form-control"} value={filter.datefrom} onChange={({ target: { value } }) => { updateFilter({ key: 'datefrom', value }) }} />
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="dateTo">Date to:</label>
                    <input type={"date"} id="dateto" className={"form-control"} value={filter.dateto} onChange={({ target: { value } }) => { updateFilter({ key: 'dateto', value }) }} />
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="collectionOption">Collection:</label>
                    <select className={"form-control"} id="collectionOption"
                        value={filter.collection}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'collection', value }) }}>
                        <option value="">All</option>
                        <option value="HOME">Home</option>
                        <option value="OFFICE">Office</option>
                    </select>
                </Col>
                <div className="w-100 d-none d-lg-block" />
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="status">Status:</label>
                    <select className={"form-control"} id="status"
                        value={filter.status}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'status', value: value }) }}>
                        <option value="">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="PICKED_UP">Picked up</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="IN_TRANSIT">In transit</option>
                        <option value="ARRIVED">Arrived</option>
                        <option value="RECEIVED">Received</option>
                        <option value="DELAYED">Delayed</option>
                        <option value="RELEASED">Released</option>
                    </select>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="route">Route:</label>
                    <select className={"form-control"} id="route"
                        value={filter.route}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'route', value: value }) }}>
                        <option value="">All</option>
                        {routes.map((item, index) => (
                            <option value={`${item.sourceCountryCode}/${item.destinationCountryCode}`} key={index}>{`${item.sourceCountryCode}/${item.destinationCountryCode}`}</option>
                        ))}
                    </select>
                </Col>
                {accountType === 'ADMIN' && accountId === "1" &&
                    <Col xs={6} md={4} lg={2}>
                        <label htmlFor="agent">Agent:</label>
                        <select className={"form-control"} id="agent"
                            value={filter.agent}
                            onChange={({ target: { value } }) => { updateFilter({ key: 'agent', value: value }) }}>
                            <option value="">All</option>
                            {agents && agents.map((item, index) => (
                                <option value={item.id} key={index}>{item.username}</option>
                            ))}
                        </select>
                    </Col>}

                <Col xs={6} md={4} lg={2}>
                    <label htmlFor="agent">Interval:</label>
                    <select className={"form-control"} id="interval" name="intrvl"
                        value={filter.interval}
                        onChange={({ target: { value } }) => { updateFilter({ key: 'interval', value: value }) }}>
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                    </select>
                </Col>

                <Col xs={4} className="ms-auto">
                    <label>&nbsp;</label>
                    <ButtonGroup className={"d-flex align-items-end"}>
                        <Button variant={"primary"} block onClick={handleFilter}>Filter</Button>
                        {(JSON.stringify(initFilter) !== JSON.stringify(filter)) &&
                            <Button variant={"danger"} onClick={resetFilter}>&times;</Button>
                        }
                    </ButtonGroup>
                </Col>
            </Row>
            <hr />

            <div className="row">
                <div className="alert alert-info p-1 text-center" style={{ fontSize: "14px" }}>
                    In case custom date selected Previous period will be same period from last year else it will be same month from last year.
                </div>
                {(isAdmin || isSubAdmin || viewTotalPrice) && !loading && summary ? (
                    summary.prices.map((price, i) => (
                        <SummaryStatisticsBlock
                            loading={loading}
                            data={price}
                            title={'Total Price'}
                            icon={null}
                            isIconCurrency={true}
                        />
                    ))
                ) : ("")}

                {(isAdmin || isSubAdmin || viewClientsRegistered) && summary && (
                    <SummaryStatisticsBlock
                        loading={loading}
                        data={summary.customers}
                        title={'Clients Registered'}
                        icon={'bi-people-fill'}
                        isIconCurrency={false}
                    />
                )}
                {(isAdmin || isSubAdmin || viewNewClients) && summary && (
                    <SummaryStatisticsBlock
                        loading={loading}
                        data={summary.unverifiedCustomers}
                        title={'New Clients'}
                        icon={'bi bi-people'}
                        isIconCurrency={false}
                    />
                )}
                {(isAdmin || isSubAdmin || viewClientsUsedService) && summary && (
                    <SummaryStatisticsBlock
                        loading={loading}
                        data={summary.customersUsed}
                        title={'Clients Used Service'}
                        icon={'bi bi-person-hearts'}
                        isIconCurrency={false}
                    />
                )}

                {(isAdmin || isSubAdmin || viewItems) && summary && (
                    <SummaryStatisticsBlock
                        loading={loading}
                        data={summary.parcels}
                        title={'Items'}
                        icon={'bi-boxes'}
                        isIconCurrency={false}
                    />
                )}

                {(isAdmin || isSubAdmin || viewBookings) && summary && (
                    <SummaryStatisticsBlock
                        loading={loading}
                        data={summary.bookings}
                        title={'Bookings'}
                        icon={'bi-card-list'}
                        isIconCurrency={false}
                    />
                )}
                {(isAdmin || isSubAdmin || viewUnpaid) && summary && summary.unpaid.length > 0 && summary.unpaid.map(cur => (
                    < SummaryStatisticsBlock
                        loading={loading}
                        data={cur}
                        title={`Unpaid in ${cur.invoice_currency_code}`}
                        icon={'bi bi-emoji-frown-fill'}
                        isIconCurrency={true}
                    />
                ))}

                {summary && summary.pricesParts.length > 0 && [...new Set(statisticsData.map(d => d.currency))].map(cur => (
                    <>
                        {(isAdmin || isSubAdmin || viewFreight) && <SummaryStatisticsBlock
                            loading={loading}
                            data={{
                                total: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.freight_price || 0,
                                previous_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.freight_price_previous_month ?? 0,
                                current_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.freight_price_current_month ?? 0,
                                invoice_currency_code: cur
                            }}
                            title={'Freight'}
                            icon={'bi-airplane'}
                            isIconCurrency={true}
                        />}
                        {(isAdmin || isSubAdmin || viewPackaging) && <SummaryStatisticsBlock
                            loading={loading}
                            data={{
                                total: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.packaging_price ?? 0,
                                previous_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.packaging_price_previous_month ?? 0,
                                current_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.packaging_price_current_month ?? 0,
                                invoice_currency_code: cur
                            }}
                            title={'Packaging'}
                            icon={'bi-box-seam'}
                            isIconCurrency={true}
                        />}
                        {(isAdmin || isSubAdmin || viewDelivery) && <SummaryStatisticsBlock
                            loading={loading}
                            data={{
                                total: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.delivery_price ?? 0,
                                previous_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.delivery_price_previous_month ?? 0,
                                current_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.delivery_price_current_month ?? 0,
                                invoice_currency_code: cur
                            }}
                            title={'Delivery'}
                            icon={'bi-truck'}
                            isIconCurrency={true}
                        />}
                        {(isAdmin || isSubAdmin || viewExtraCharges) && <SummaryStatisticsBlock
                            loading={loading}
                            data={{
                                total: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.extra_charges ?? 0,
                                previous_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.extra_charges_previous_month ?? 0,
                                current_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.extra_charges_current_month ?? 0,
                                invoice_currency_code: cur
                            }}
                            title={'Extra Charges'}
                            icon={'bi-cash-coin'}
                            isIconCurrency={true}
                        />}
                        {(isAdmin || isSubAdmin || viewDiscount) && <SummaryStatisticsBlock
                            loading={loading}
                            data={{
                                total: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.discount ?? 0,
                                previous_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.discount_previous_month ?? 0,
                                current_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.discount_current_month ?? 0,
                                invoice_currency_code: cur
                            }}
                            title={'Discount'}
                            icon={'bi-percent'}
                            isIconCurrency={true}
                        />}
                        {(isAdmin || isSubAdmin || viewWeight) && <SummaryStatisticsBlock
                            loading={loading}
                            data={{
                                total: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.weight ?? 0,
                                previous_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.weight_previous_month ?? 0,
                                current_month: summary.pricesParts.find(pp => pp.invoice_currency_code === cur)?.weight_current_month ?? 0,
                                invoice_currency_code: cur
                            }}
                            title={`Weight ${currency_symbols(cur)}`}
                            icon={'bi-triangle'}
                            isIconCurrency={false}
                        />}

                    </>
                ))}

            </div>

            <div className="row">
                <div className="col-12 col-xl-7 mb-4">
                    {summary && (isAdmin || isSubAdmin || viewAgentStatistics) && (
                        <Agents
                            loading={loading}
                            agents={summary.agents}
                        />
                    )}
                </div>
                <div className="col-12 col-xl-5 mb-4">
                    {summary && (isAdmin || isSubAdmin || viewActivity) && (
                        <ActivityBlock
                            loading={loading}
                            data={summary.activity}
                        />
                    )}
                    <br/>
                    {summary && (isAdmin || isSubAdmin) && (
                        <Periods
                            loading={loading}
                            periods={summary.periods}
                        />
                    )}
                </div>
            </div >
            <div className="row">
                <nav>
                    <div className="nav nav-tabs bg-white" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="line1-tab" data-bs-toggle="tab" data-bs-target="#line1" type="button" role="tab" aria-controls="line1" aria-selected="true"><i className="bi bi-graph-up me-1"></i>Line chart</button>
                        {/* <button className="nav-link" id="line2-tab" data-bs-toggle="tab" data-bs-target="#line2" type="button" role="tab" aria-controls="line2" aria-selected="false">
                            <i className="bi bi-graph-up me-1"></i> Line Chart 2
                        </button> */}
                        <button className="nav-link" id="treemap-tab" data-bs-toggle="tab" data-bs-target="#treemap" type="button" role="tab" aria-controls="treemap" aria-selected="false"><i className="bi bi-diagram-2-fill"></i> TreeMap chart</button>
                        <button className="nav-link" id="pie-tab" data-bs-toggle="tab" data-bs-target="#pie" type="button" role="tab" aria-controls="pie" aria-selected="false"><i className="bi bi-pie-chart-fill me-1"></i> Pie chart</button>
                        <button className="nav-link" id="radial-tab" data-bs-toggle="tab" data-bs-target="#radial" type="button" role="tab" aria-controls="radial" aria-selected="false"><i className="bi bi-pie-chart me-1"></i> Radial chart</button>
                        <button className="nav-link" id="columns-tab" data-bs-toggle="tab" data-bs-target="#columns" type="button" role="tab" aria-controls="columns" aria-selected="false"><i className="bi bi-bar-chart-line me-1"></i> Columns chart</button>
                        <button className="nav-link" id="stacked-tab" data-bs-toggle="tab" data-bs-target="#stacked" type="button" role="tab" aria-controls="stacked" aria-selected="false"><i className="bi bi-view-stacked me-1"></i> Stacked chart</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="line1" role="tabpanel" aria-labelledby="line1-tab">
                        <div className="col-12 col-xl-12 bg-white">
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && (
                                <CargoStatisticsTable
                                    type={'line'}
                                    filter={filter}
                                    setFilter={setFilter}
                                    statisticsData={statisticsData}
                                />
                            )}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="treemap" role="tabpanel" aria-labelledby="treemap-tab">
                        <div className="col-12 col-xl-12 bg-white">
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && (
                                <CargoStatisticsTable
                                    type={'treemap'}
                                    filter={filter}
                                    setFilter={setFilter}
                                    statisticsData={statisticsData}
                                />
                            )}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="stacked" role="tabpanel" aria-labelledby="stacked-tab">
                        <div className="col-12 col-xl-12 bg-white">
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && (
                                <CargoStatisticsTable
                                    type={'stacked'}
                                    filter={filter}
                                    setFilter={setFilter}
                                    statisticsData={statisticsData}
                                />
                            )}
                        </div>
                    </div>
                    {/* <div className="tab-pane fade" id="line2" role="tabpanel" aria-labelledby="line2-tab">
                        <div className="col-12 col-xl-12 bg-white">
                            <CargoStatisticsTable
                                type={'area'}
                                filter={filter}
                                setFilter={setFilter}
                                statisticsData={statisticsData}
                            />
                        </div>
                    </div> */}
                    <div className="tab-pane fade" id="pie" role="tabpanel" aria-labelledby="pie-tab">
                        <div className="col-12 col-xl-12 bg-white">
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && (
                                <CargoStatisticsTable
                                    type={'area'}
                                    filter={filter}
                                    setFilter={setFilter}
                                    statisticsData={statisticsData}
                                />
                            )}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="columns" role="tabpanel" aria-labelledby="columns-tab">
                        <div className="col-12 col-xl-12 bg-white">
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && (
                                <CargoStatisticsTable
                                    type={'columns'}
                                    filter={filter}
                                    setFilter={setFilter}
                                    statisticsData={statisticsData}
                                />
                            )}
                        </div>
                    </div>

                    <div className="tab-pane fade bg-white" id="radial" role="tabpanel" aria-labelledby="radial-tab">
                        <div className="row">
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && summary && (
                                <ClientsChart
                                    clientsRegistered={+summary.customers.total}
                                    clientsUsedService={+summary.customersUsed.total}
                                    newClients={+summary.unverifiedCustomers.total}
                                />
                            )}
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && summary && (
                                <WeightChart
                                    data={statisticsData}
                                />
                            )}
                            {(isAdmin || isSubAdmin || viewCargoStatistics) && summary && (
                                <FreightChart
                                    data={statisticsData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivateSummary;