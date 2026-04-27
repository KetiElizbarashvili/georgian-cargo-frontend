import { Spinner } from "react-bootstrap";
import { currency_symbols } from "utils/Currency";
import { percentageTwoNumber } from "utils/functions";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'

function SummaryStatisticsBlock({ data, loading, title, icon, isIconCurrency }) {
    let st = data.current_month > data.previous_month;
    return (
        <div className="col-12 col-sm-6 col-xl-2 mb-4">
            <div className={"card border border-2 shadow " + (st ? 'border-success' : 'border-danger')} h-100>
                <div className="card-body p-3">
                    <OverlayTrigger
                        placement="auto"
                        trigger={["focus", "hover"]}
                        overlay={(
                            <Popover>
                                <Popover.Title>
                                    Details
                                </Popover.Title>
                                <Popover.Content>
                                    <p>Current period: <b>{
                                        isIconCurrency
                                            ? Intl.NumberFormat('en', { style: 'currency', currency: data.invoice_currency_code }).format(data.current_month)
                                            : Intl.NumberFormat('en').format(data.current_month)
                                    }</b></p>
                                    <p>Previous period: <b>{
                                        isIconCurrency
                                            ? Intl.NumberFormat('en', { style: 'currency', currency: data.invoice_currency_code }).format(data.previous_month)
                                            : Intl.NumberFormat('en').format(data.previous_month)
                                    }</b></p>
                                </Popover.Content>
                            </Popover>
                        )}>
                        <small className="text-dark fw-semibold float-end">{' '}<i className="bi bi-info-circle"></i></small>
                    </OverlayTrigger>
                    {(loading || !data) ? (
                        <Spinner />
                    ) : (
                        <div className="row d-block d-xl-flex align-items-center">
                            <div className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                <div className="icon-shape icon-shape-secondary rounded me-4 me-sm-0">
                                    {isIconCurrency && !icon && (
                                        <span style={{ fontSize: "50px", color: "#747474" }}>{currency_symbols(data.invoice_currency_code)}</span>
                                    )}
                                    {icon && (
                                        <i style={{ fontSize: "50px", color: "#747474" }} className={`bi ${icon}`}></i>
                                    )}
                                </div>
                                <div className="d-sm-none">
                                    <h2 className="h5 text-muted">{title}</h2>
                                    <h3 className="fw-extrabold mb-1">{
                                        isIconCurrency
                                            ? Intl.NumberFormat('en', { style: 'currency', currency: data.invoice_currency_code }).format(data.total)
                                            : Intl.NumberFormat('en').format(data.total)
                                    }</h3>
                                </div>
                            </div>
                            <div className="col-12 col-xl-7 px-xl-0">
                                <div className="d-none d-sm-block">
                                    <h2 className="h5" style={{ color: "#747474" }}>{title}</h2>
                                    <h3 className="fw-extrabold mb-1">{
                                        isIconCurrency
                                            ? Intl.NumberFormat('en', { style: 'currency', currency: data.invoice_currency_code }).format(data.total)
                                            : Intl.NumberFormat('en').format(data.total)
                                    }</h3>
                                </div>
                                <div className="small d-flex mt-1">
                                    <i className={"bi " + (st ? 'bi-chevron-up text-success' : 'bi-chevron-down text-danger')}></i>
                                    <div><span className={"fw-bolder me-1 " + (st ? 'text-success' : 'text-danger')}>
                                        {isFinite(percentageTwoNumber(data.current_month, data.previous_month))
                                            ? percentageTwoNumber(data.current_month, data.previous_month)
                                            : '100'}%
                                    </span> Compared to previous period</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default SummaryStatisticsBlock;