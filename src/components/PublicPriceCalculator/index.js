import { useEffect, useState } from "react";
import calculateCargoPricesPublic from 'requests/calculateCargoPricesPublic';
import useRequest from "hooks/useRequest";
import { currency_symbols } from 'utils/Currency';

export const PublicPriceCalculator = ({ allRoutesData, routePairs = [], redirectToBooking }) => {
    const [calculateCargoPricesPublicReq] = useRequest(calculateCargoPricesPublic);
    const [calculatedPrice, setCalculatedPrice] = useState(null);
    const [routeError, setRouteError] = useState(false);
    const [calculatePricesData, setCalculatePricesData] = useState({
        source_country_code: "",
        destination_country_code: "",
        collection_option: "HOME",
        delivery_option: "HOME",
        customer_type: "INDIVIDUAL",
        parcel_type: "PARCEL",
        weight: '',
        packaging: 1,
        min_price: 0
    });

    const hasInputs = calculatePricesData.source_country_code !== ''
        && calculatePricesData.destination_country_code !== ''
        && parseInt(calculatePricesData.weight) > 0;

    useEffect(() => {
        if (hasInputs) {
            setRouteError(false);
            calculateCargoPricesPublicReq({ ...calculatePricesData, collection_option: "HOME", delivery_option: "HOME" }).then((res) => {
                let obj = res.data.prices;
                setCalculatedPrice({
                    currency: currency_symbols(obj.currency_code),
                    value: parseFloat(
                        (calculatePricesData.collection_option === 'HOME' ? obj.delivery_price : 0)
                        + obj.freight_price
                        + obj.packaging_price
                        + (calculatePricesData.delivery_option === 'HOME' ? obj.delivery_price : 0)
                    ).toFixed(2)
                });
            }).catch(() => {
                setCalculatedPrice(null);
                setRouteError(true);
            });
        } else {
            setCalculatedPrice(null);
            setRouteError(false);
        }
    }, [calculatePricesData]);

    const validSources = routePairs.length > 0
        ? allRoutesData.filter(c => routePairs.some(p => p.source_country_code === c.value))
        : allRoutesData;

    const validDestinations = calculatePricesData.source_country_code && routePairs.length > 0
        ? allRoutesData.filter(c => routePairs.some(
            p => p.source_country_code === calculatePricesData.source_country_code
              && p.destination_country_code === c.value
          ))
        : allRoutesData;

    const toggle = (field) => setCalculatePricesData(prev => ({
        ...prev,
        [field]: field === 'packaging'
            ? 1 - prev.packaging
            : prev[field] === 'HOME' ? 'OFFICE' : 'HOME'
    }));

    const options = [
        { field: 'collection_option', label: 'Pickup from address', icon: 'bi-house-up' },
        { field: 'delivery_option',   label: 'Deliver to address',   icon: 'bi-house-down' },
        { field: 'packaging',         label: 'Packaging service',    icon: 'bi-box-seam' },
    ];

    const isActive = (field) => field === 'packaging'
        ? calculatePricesData.packaging === 1
        : calculatePricesData[field] === 'HOME';

    return (
        <section className="gc-calc">
            <div className="gc-calc__header">
                <h2 className="gc-calc__title">Calculate Shipping Price</h2>
                <p className="gc-calc__subtitle">Get an instant estimate — enter route and weight below</p>
            </div>

            <div className="gc-calc__card">
                {/* Price display */}
                <div className={`gc-calc__price-row${routeError ? ' gc-calc__price-row--error' : ''}`}>
                    <div className="gc-calc__price-box">
                        <span className="gc-calc__price-label">Estimated price</span>
                        <span className={`gc-calc__price-value${calculatedPrice ? ' gc-calc__price-value--active' : ''}`}>
                            {calculatedPrice ? `${calculatedPrice.currency}${calculatedPrice.value}` : '—'}
                        </span>
                        {calculatedPrice && <span className="gc-calc__price-note">incl. selected services</span>}
                        {routeError && <span className="gc-calc__price-note">No pricing found for this route</span>}
                    </div>
                    <div className="gc-calc__plane-icon">
                        <i className={routeError ? 'bi bi-exclamation-circle' : 'bi bi-airplane-engines'}></i>
                    </div>
                </div>

                {/* Route selects */}
                <div className="gc-calc__route">
                    <div className="gc-calc__select-wrap">
                        <label className="gc-calc__label">From</label>
                        <select
                            className="gc-calc__select"
                            value={calculatePricesData.source_country_code}
                            onChange={(e) => setCalculatePricesData({
                                ...calculatePricesData,
                                source_country_code: e.target.value,
                                destination_country_code: ''
                            })}
                        >
                            <option value="">Select country</option>
                            {(validSources || allRoutesData).map((c, i) => (
                                <option key={i} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="gc-calc__arrow">
                        <i className="bi bi-arrow-right"></i>
                    </div>

                    <div className="gc-calc__select-wrap">
                        <label className="gc-calc__label">To</label>
                        <select
                            className="gc-calc__select"
                            value={calculatePricesData.destination_country_code}
                            onChange={(e) => setCalculatePricesData({ ...calculatePricesData, destination_country_code: e.target.value })}
                            disabled={!calculatePricesData.source_country_code}
                        >
                            <option value="">Select country</option>
                            {(validDestinations || allRoutesData).map((c, i) => (
                                <option key={i} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Weight */}
                <div className="gc-calc__weight-row">
                    <label className="gc-calc__label">Parcel weight</label>
                    <div className="gc-calc__weight-input-wrap">
                        <input
                            className="gc-calc__weight-input"
                            type="number"
                            min="0"
                            placeholder="0.0"
                            value={calculatePricesData.weight}
                            onChange={(e) => setCalculatePricesData({ ...calculatePricesData, weight: parseFloat(e.target.value) })}
                        />
                        <span className="gc-calc__weight-unit">kg</span>
                    </div>
                </div>

                {/* Options */}
                <div className="gc-calc__options">
                    {options.map(({ field, label, icon }) => (
                        <button
                            key={field}
                            type="button"
                            className={`gc-calc__option${isActive(field) ? ' gc-calc__option--on' : ''}`}
                            onClick={() => toggle(field)}
                        >
                            <i className={`bi ${icon} gc-calc__option-icon`}></i>
                            <span className="gc-calc__option-label">{label}</span>
                            <span className="gc-calc__option-toggle">
                                {isActive(field) ? 'On' : 'Off'}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Info note */}
                <p className="gc-calc__info">
                    <i className="bi bi-info-circle"></i> Weight is verified at our warehouse — final price may be adjusted.
                </p>

                {/* CTA */}
                <button className="gc-calc__cta" type="button" onClick={redirectToBooking}>
                    Book Now <i className="bi bi-arrow-right ms-1"></i>
                </button>
            </div>
        </section>
    );
};
