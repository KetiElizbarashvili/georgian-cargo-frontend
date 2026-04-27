import { useEffect, useState } from "react";
import calculateCargoPricesPublic from 'requests/calculateCargoPricesPublic';
import useRequest from "hooks/useRequest";
import { currency_symbols } from 'utils/Currency';

export const PublicPriceCalculator = ({ allRoutesData, redirectToBooking }) => {
    const [calculateCargoPricesPublicReq] = useRequest(calculateCargoPricesPublic);
    const [calculatedPrice, setCalculatedPrice] = useState({
        currency: currency_symbols('GBP'),
        value: 0.00
    });
    const [calculatePricesData, setCalculatePricesData] = useState({
        source_country_code: "",
        destination_country_code: "",
        collection_option: "HOME",
        delivery_option: "HOME",
        customer_type: "INDIVIDUAL",
        parcel_type: "parcel",
        weight: '',
        packaging: 1,
        min_price: 0
    });

    useEffect(() => {
        if (
            calculatePricesData.source_country_code !== ''
            && calculatePricesData.destination_country_code !== ''
            && parseInt(calculatePricesData.weight) > 0) {
            calculateCargoPricesPublicReq({ ...calculatePricesData, collection_option: "HOME", delivery_option: "HOME" }).then((res) => {
                let obj = res.data.prices;
                setCalculatedPrice({
                    ...calculatedPrice,
                    currency: currency_symbols(obj.currency_code),
                    value: parseFloat((calculatePricesData.collection_option === 'HOME' ? obj.delivery_price : 0) + obj.freight_price + obj.packaging_price + (calculatePricesData.delivery_option === 'HOME' ? obj.delivery_price : 0)).toFixed(2)
                });
            }).catch((error) => {
                setCalculatedPrice({
                    currency: '',
                    value: 'Route does not exist!'
                });
            });
        }
    }, [calculatePricesData]);

    return (
        <figure className="figure w-100">
            <figcaption className="figure-caption mb-4">
                <h2 className="card-title mb-4 h4 text-primary" style={{ letterSpacing: ".3rem", textTransform: "uppercase" }}>Calculate Prices</h2>
                <p className="card-text h4 text-muted w-100 mx-auto" ><i className="bi bi-info-circle-fill"></i>  Item will be weight checked at our storage and price may be corrected depending on the weight</p>
            </figcaption>
            <div className='container w-100'>
                <div className="row mt-3 mx-3" style={{ marginTop: "25px" }}>
                    <div className="col-md-12 justify-content-center">
                        <div className="card card-custom pb-4">
                            <div className="card-body mt-0 mx-5">
                                <div className="text-center mb-3 pb-2 mt-3">
                                    <div style={{ marginLeft: "10px" }} className="text-center">
                                        <i className="bi bi-airplane-engines text-primary" style={{ fontSize: "60px" }}></i>
                                        <span className="mt-3 text-primary h2 d-block w-100">{calculatedPrice.currency}{calculatedPrice.value}</span>
                                    </div>
                                </div>

                                <form className="mb-0">

                                    <div className="row mb-6">
                                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                                            <div className="form-outline">
                                                <select
                                                    onChange={(e) => setCalculatePricesData({ ...calculatePricesData, source_country_code: e.target.value })}

                                                    className="form-select" aria-label="Default select example">
                                                    <option selected>Choose source country</option>
                                                    {allRoutesData.map((c, i) => (
                                                        <option key={i} value={c.value}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                                            <div className="form-outline">
                                                <select
                                                    onChange={(e) => setCalculatePricesData({ ...calculatePricesData, destination_country_code: e.target.value })}
                                                    className="form-select" aria-label="Default select example">
                                                    <option selected>Choose destination country</option>
                                                    {allRoutesData.map((c, i) => (
                                                        <option key={i} value={c.value}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-6">
                                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                                            <div className="form-outline">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input"
                                                        checked={calculatePricesData.delivery_option === 'HOME'}
                                                        onChange={(e) => setCalculatePricesData({ ...calculatePricesData, delivery_option: calculatePricesData.delivery_option === 'HOME' ? 'OFFICE' : 'HOME' })}
                                                        type="checkbox" id="flexSwitchCheckDefault" />
                                                    <label className="form-check-label fw-bold d-block w-100" for="flexSwitchCheckDefault">Pickup from my address</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                                            <div className="form-outline">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input"
                                                        checked={calculatePricesData.collection_option === 'HOME'}
                                                        onChange={(e) => setCalculatePricesData({ ...calculatePricesData, collection_option: calculatePricesData.collection_option === 'HOME' ? 'OFFICE' : 'HOME' })}
                                                        type="checkbox" id="flexSwitchCheckDefault" />
                                                    <label className="form-check-label fw-bold d-block w-100" for="flexSwitchCheckDefault">Delivery to my address</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                                            <div className="form-outline">
                                                <div className="form-check form-switch">
                                                    <input
                                                        checked={calculatePricesData.packaging === 1}
                                                        onChange={(e) => setCalculatePricesData({ ...calculatePricesData, packaging: 1 - calculatePricesData.packaging })}
                                                        className="form-check-input" type="checkbox" id="switchpackaging" />
                                                    <label className="form-check-label fw-bold d-block w-100" for="switchpackaging">Packaging service</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-12 col-md-6 mx-auto">
                                            <div className="form-outline">
                                                <div class="form-floating mb-4">
                                                    <input
                                                        value={calculatePricesData.weight}
                                                        onChange={(e) => setCalculatePricesData({ ...calculatePricesData, weight: parseFloat(e.target.value) })}
                                                        type="number" name="email" id="weight" class="form-control form-control-lg shadow-none" placeholder="Weight" />
                                                    <label class="form-label" for="weight">Weight in KG</label></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4 mb-2 mx-auto">
                                        <button className="form-control rounded-0 border-0 btn btn-secondary btn-lg" type="button" id="button-addon2"
                                            onClick={redirectToBooking}
                                        >Book Now</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </figure>
    );
};