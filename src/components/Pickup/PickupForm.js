import { useEffect, useState, useContext } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "context";
import countryListAllIsoData from "utils/CountryList";
import getCustomerAddressSuggestions from "requests/getCustomerAddressSuggestions";
import getParcelPrice from "requests/getPArcelPrices";
import useRequest from "../../hooks/useRequest";
import { toast } from "react-toastify";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { SummaryForm } from "./SummaryForm";
import { getPublicParcelByTrackingNumber } from "requests";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const renderSuggestion = (suggestion) => {
  return (
    <div role="button" className="text-black"
      style={{ zIndex: "99" }}>
      {suggestion.name}
    </div>
  );
};

const parcelTemplate = {
  "customer_type": "INDIVIDUAL",
  "tracking_number": "",
  "description": "Clothes",
  "notes": "",
  "weight": "",
  "item_price": 75,
  "item_currency_code": "EUR",
  "collection_option": "OFFICE",
  "packaging": 1,
  "min_price": 1,
  "extra_charges": [],
  "parcel_type": "PARCEL",
  "sender": {
    "address_line_1": "",
    "address_line_2": "",
    "country_code": "UK",
    "email": "",
    "name": "",
    "phone": "",
    "postal_code": ""
  },
  "receiver": {
    "address_line_1": "",
    "address_line_2": "",
    "country_code": "GE",
    "email": "",
    "name": "",
    "phone": "",
    "postal_code": ""
  },
  "prices": {},
  "payment_method": "ONLINE",
  "invoiceHash": [],
  "coupon_code": "",
  "source_country_code": "UK",
  "destination_country_code": "GE",
};


const PickupForm = () => {
  const [startPickup, setStartPickup] = useState(false);
  const [addingParcel, setAddingParcel] = useState(false);
  const [changing, setChanging] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('sender');
  const [customerSuggestion] = useRequest(getCustomerAddressSuggestions);
  const [parcelPriceData] = useRequest(getParcelPrice);
  const [barCode, setBarCode] = useState(null);
  const [gettingCargoPrices, setGettingCargoPrices] = useState(false);
  const [getTrackingHistory] = useRequest(getPublicParcelByTrackingNumber);
  const [extraChargeObj, setExtraChargeObj] = useState({
    "amount": "",
    "note": ""
  });
  const [parcel, setParcel] = useState({
    "customer_type": "INDIVIDUAL",
    "tracking_number": "",
    "description": "Clothes",
    "notes": "",
    "weight": "",
    "item_price": 75,
    "item_currency_code": "EUR",
    "collection_option": "OFFICE",
    "packaging": 1,
    "min_price": 1,
    "extra_charges": [],
    "parcel_type": "PARCEL",
    "sender": {
      "address_line_1": "",
      "address_line_2": "",
      "country_code": "UK",
      "email": "",
      "name": "",
      "phone": "",
      "postal_code": ""
    },
    "receiver": {
      "address_line_1": "",
      "address_line_2": "",
      "country_code": "GE",
      "email": "",
      "name": "",
      "phone": "",
      "postal_code": ""
    },
    "prices": {},
    "payment_method": "ONLINE",
    "invoiceHash": [],
    "coupon_code": "",
    "source_country_code": "UK",
    "destination_country_code": "GE",
  });
  const [senderSuggestions, setSenderSuggestions] = useState([]);
  const [receiverSuggestions, setReceiverSuggestions] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [showPrices, setShowPrices] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [barcodeScanner, setBarcodeScanner] = useState(false);
  const [index, setIndex] = useState(null);
  const [prices, setPrices] = useState({
    "currency_code": "",
    "freight_price": "",
    "delivery_price": "",
    "packaging_price": ""
  });
  const { auth: { routes, staff, accountType, accountId } } = useContext(AuthContext);

  const NewParcelModal = () => {
    setStartPickup(true);
    setParcel(parcelTemplate);
    if (parcels.length > 0) {
      // setParcel({ ...parcelTemplate, sender: parcels[0].sender });
    }
  };

  useEffect(() => {
    setParcel({ ...parcel, tracking_number: barCode });
    setBarcodeScanner(false);
  }, [barCode]);

  useEffect(() => {
    console.log(routes);
    // setParcel({ ...parcel, ["receiver"]: { ...parcel["receiver"], ["country_code"]: routes[0].sourceCountryCode } })
  }, [routes]);

  useEffect(() => {
    setGettingCargoPrices(true);
    const delayDebounceFn = setTimeout(() => {
      if (parcel.weight !== '') {
        parcelPriceData({
          source_country_code: parcel.sender.country_code,
          destination_country_code: parcel.receiver.country_code,
          collection_option: parcel.collection_option,
          customer_type: parcel.customer_type,
          parcel_type: parcel.parcel_type,
          weight: parcel.weight,
          packaging: parcel.packaging,
          min_price: parcel.min_price,
        })
          .then((response) => {
            console.log(response);
            let sp = response?.data?.error === undefined ? true : response?.data?.error;
            setShowPrices(!sp);
            if (!sp) {
              setPrices(response.data.prices);
              setParcel({ ...parcel, prices: response.data.prices });

            } else {
              setParcel({ ...parcel, prices: {} });
            }
            setGettingCargoPrices(false);
          })
      }
    }, 1500)

    return () => clearTimeout(delayDebounceFn)
  }, [
    parcel.sender.country_code,
    parcel.receiver.country_code,
    parcel.min_price,
    parcel.packaging,
    parcel.customer_type,
    parcel.type,
    parcel.weight,
    parcel.collection_option
  ]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (parcel.sender.name !== '') {
        customerSuggestion({ name: parcel.sender.name })
          .then((response) => {
            setSenderSuggestions(response.data.customers);
          })
          .catch((e) => console.error(e, 999));
      }
    }, 1500);
    return () => clearTimeout(delayDebounceFn)

  }, [parcel.sender.name]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (parcel.receiver.name !== '') {
        customerSuggestion({ name: parcel.receiver.name })
          .then((response) => {
            setReceiverSuggestions(response.data.receivers);
          })
          .catch((e) => console.error(e, 999));
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn)
  }, [parcel.receiver.name]);

  const handleUpdateTrgt = (e, trgt) => {
    setParcel({ ...parcel, [trgt]: { ...parcel[trgt], [e.target.name]: e.target.value } })
  };

  const handleUpdate = (e) => {
    setParcel({ ...parcel, [e.target.name]: e.target.value })
  };

  const handleExtraItem = (e) => {
    setExtraChargeObj({ ...extraChargeObj, [e.target.name]: e.target.value })
  };

  const addExtraItem = () => {
    setParcel({ ...parcel, extra_charges: [...parcel.extra_charges, extraChargeObj] });
    setExtraChargeObj({
      "amount": "",
      "note": ""
    });
  };

  const TrgtFromSuggestion = (suggestion, trgt) => {
    setParcel({
      ...parcel, [trgt]: {
        ...parcel[trgt],
        address_line_1: suggestion.address.address_line_1,
        address_line_2: suggestion.address.address_line_2,
        country_code: suggestion.address.country_code,
        email: suggestion.email,
        postal_code: suggestion.address.postal_code,
        name: suggestion.name,
        phone: suggestion.phone,
      }
    });
    setSenderSuggestions([]);
    setReceiverSuggestions([]);
  };

  function checkIfTrackingNumberIsFree() {

    fetch(process.env.REACT_APP_API + "/cargo/track", {
      method: 'POST',
      headers: {
        // 'Authorization': 'Beared ' + accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tracking_number: parcel.tracking_number })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error === false) {
          toast.error('this tracking number already used. please use another one.', toastOptions);
        } else {
          AddParcelTo();
        }
      })
      .catch(error => {
      });
  };
  const AddParcelTo = () => {
    setAddingParcel(true);
    if (changing) {
      let prcls = [...parcels];

      const newState = prcls.map((obj, i) => {
        if (index !== null && index === i) {
          return parcel;
        }
        return obj;
      });
      setParcels(newState);
      setParcel(parcelTemplate);
      setStartPickup(false);
    } else {
      let ist = parcels.find(item => item.tracking_number === parcel.tracking_number);
      if (ist === undefined) {
        setParcels([...parcels, parcel]);
        setParcel(parcelTemplate);
        setStartPickup(false);
      } else {
        toast.error('you have already used this tracking number.', toastOptions);
      }
    }
    setAddingParcel(false);

  };

  const DeleteParcel = (trackingNumber) => {
    let prcls = [...parcels];
    setParcels(prcls.filter(item => item.tracking_number !== trackingNumber));
  };

  const removeExtra = (extra) => {
    let extras = [...parcel.extra_charges];
    let result = extras.filter(item => item.note !== extra.node && item.amount !== extra.amount);
    setParcel({ ...parcel, extra_charges: result });
  };


  return (
    <>
      <div className="card mb-3 p-1" >
        <div
          className="card-body p-2 my-auto">
          <div>
            <button
              onClick={() => (NewParcelModal(), setChanging(false))}
              type="button" className="btn btn-primary btn-lg float-start"><i className="bi bi-plus-square-dotted"></i> Add parcel</button>

            <button
              disabled={parcels.length === 0}
              onClick={() => setShowSummary(true)}
              type="button" className="btn btn-warning btn-lg float-end">Summary</button>
          </div>

        </div>

      </div>
      <div className="row p-2">
        {parcels && parcels.length > 0 && parcels.map((prcl, i) => (
          <div className="col-6 col-md-3 p-1" key={prcl.tracking_number}

          >
            <div className="card border-dark mb-3 p-1" style={{ maxWidth: "18rem" }}>
              <div className="card-header card-title p-2 position-relative"> {prcl.tracking_number}
                <button
                  onClick={() => DeleteParcel(prcl.tracking_number)}
                  className="btn btn-danger p-2 position-absolute"
                  style={{ top: "0", right: "0" }}
                ><i className="bi bi-x"></i>
                </button>

              </div>
              <div className="card-body p-2">
                <h5 className="">{prcl.receiver.name}</h5>
              </div>
              <div className="card-footer p-1 text-start">
                <button
                  onClick={() => (setChanging(true), setParcel(prcl), setIndex(i), setStartPickup(true))}
                  className="btn btn-warning p-2 w-100"><i className="bi bi-pencil-square"></i> change</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        size="xl"
        onHide={() => setShowSummary(false)}
        show={showSummary}
        fullscreen={true}
        aria-labelledby="create-route-title"
        backdrop="static"
      >
        <Modal.Header closeButton />

        <Modal.Body className="pt-0 ps-0 pe-0">
          <SummaryForm parcels={parcels} setParcels={setParcels} staff={staff} setShowSummary={setShowSummary} />
        </Modal.Body>
      </Modal>

      <Modal
        size="xl"
        onHide={() => setBarcodeScanner(false)}
        show={barcodeScanner}
        fullscreen={true}
        aria-labelledby="create-route-title"
        backdrop="static"
      >
        <Modal.Header closeButton />

        <Modal.Body className="pt-0">
          <BarcodeScannerComponent
            width={500}
            height={500}
            torch={false}
            onUpdate={(err, result) => {
              if (result) {
                setBarCode(result.text);
              }
            }}
          />
        </Modal.Body>
      </Modal>

      <Modal
        size="xl"
        onHide={() => setStartPickup(false)}
        show={startPickup}
        fullscreen={true}
        aria-labelledby="create-route-title"
        backdrop="static"
      >
        <Modal.Header closeButton />
        {/* <Modal.Header>
          <button className="btn btn-sm btn-danger float-end" onClick={() => setStartPickup(false)}>Close</button>
        </Modal.Header> */}

        <Modal.Body className="pt-0">
          <>
            <Tabs
              defaultActiveKey={activeNavTab}
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="sender" title="Sender">

                <div className="form-floating mb-1">
                  <input
                    value={parcel.sender.name}
                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                    type="text" name="name" className="form-control position-relative" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Sender Name</label>
                  {senderSuggestions && senderSuggestions.length > 0 && parcel.sender.name !== '' && (
                    <div className="list-group w-100 shadow-md position-absolute overflow-scroll" style={{ zIndex: 5, height: "400px" }}>
                      {senderSuggestions.map((suggestion, i) => (
                        <a role="button" key={i}
                          onClick={() => TrgtFromSuggestion(suggestion, 'sender')}
                          className="list-group-item list-group-item-action d-flex p-3" aria-current="true">
                          <div className="d-flex gap-2 w-100 justify-content-between">
                            <div>
                              <h6 className="mb-0">{suggestion.name}</h6>
                            </div>
                            <small className="opacity-50 text-nowrap">{suggestion.address.country_code}</small>
                          </div>
                        </a>
                      ))}

                    </div>
                  )}
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.sender.phone}
                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                    type="text" name="phone" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Sender Phone</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.sender.email}
                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                    type="email" name="email" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Sender Email</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.sender.address_line_1}
                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                    type="text" name="address_line_1" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Sender Address line 1</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.sender.address_line_2}
                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                    type="text" name="address_line_2" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Sender Address line 2</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.sender.postal_code}
                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                    type="text" name="postal_code" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Sender postal code</label>
                </div>
                <div className="form-floating mb-1">
                  <select
                    value={parcel.sender.country_code}
                    onChange={(e) => handleUpdateTrgt(e, 'sender')}
                    type="text" name="country_code" className="form-control" id="floatingInput" placeholder="">
                    {routes && [...new Set(routes.map(x => x.sourceCountryCode))].map((route, i) => (
                      <option key={i} value={route}>{countryListAllIsoData.find(item => item.value === route).label}</option>
                    ))}
                  </select>
                  <label for="floatingInput">Sender address country code</label>
                </div>
                <div className="form-floating mb-1">
                  <select type="text" name="parcel_type" className="form-control" id="floatingInput" placeholder="">
                    <option value={'PARCEL'}>Parcel</option>
                  </select>
                  <label for="floatingInput">Parcel type</label>
                </div>
                <label className="mt-2 mb-2 me-3">Customer type</label>
                <div className="form-check form-check-inline">
                  <input
                    onChange={handleUpdate}
                    checked={parcel.customer_type === "INDIVIDUAL"}
                    value="INDIVIDUAL" className="form-check-input" type="radio" name="customer_type" id="inlineRadio1" />
                  <label className="form-check-label" for="inlineRadio1">Individual</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    onChange={handleUpdate}
                    checked={parcel.customer_type === "CORPORATE"}
                    value="CORPORATE" className="form-check-input" type="radio" name="customer_type" id="inlineRadio2" />

                  <label className="form-check-label" for="inlineRadio2">Corporate</label>
                </div>
              </Tab>
              <Tab eventKey="receiver" title="Receiver">
                <div className="form-floating mb-1">
                  <input
                    value={parcel.receiver.name}
                    onChange={(e) => handleUpdateTrgt(e, 'receiver')}
                    type="text" name="name" className="form-control position-relative" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Receiver Name</label>
                  {receiverSuggestions && receiverSuggestions.length > 0 && parcel.receiver.name !== '' && (
                    <div className="list-group w-100 shadow-md position-absolute overflow-scroll" style={{ zIndex: 5, height: "400px" }}>
                      {receiverSuggestions.map((suggestion, i) => (
                        <a role="button" key={i}
                          onClick={() => TrgtFromSuggestion(suggestion, 'receiver')}
                          className="list-group-item list-group-item-action d-flex p-3" aria-current="true">
                          <div className="d-flex gap-2 w-100 justify-content-between">
                            <div>
                              <h6 className="mb-0">{suggestion.name}</h6>
                            </div>
                            <small className="opacity-50 text-nowrap">{suggestion.address.country_code}</small>
                          </div>
                        </a>
                      ))}

                    </div>
                  )}
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.receiver.phone}
                    onChange={(e) => handleUpdateTrgt(e, 'receiver')}
                    type="text" name="phone" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Receiver Phone</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.receiver.email}
                    onChange={(e) => handleUpdateTrgt(e, 'receiver')}
                    type="email" name="email" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Receiver Email</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.receiver.address_line_1}
                    onChange={(e) => handleUpdateTrgt(e, 'receiver')}
                    type="text" name="address_line_1" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Receiver Address line 1</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.receiver.address_line_2}
                    onChange={(e) => handleUpdateTrgt(e, 'receiver')}
                    type="text" name="address_line_2" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Receiver Address line 2</label>
                </div>
                <div className="form-floating mb-1">
                  <input
                    value={parcel.receiver.postal_code}
                    onChange={(e) => handleUpdateTrgt(e, 'receiver')}
                    type="text" name="postal_code" className="form-control" id="floatingInput" placeholder="" />
                  <label for="floatingInput">Receiver postal code</label>
                </div>
                <div className="form-floating mb-1">
                  <select
                    value={parcel.receiver.country_code}
                    onChange={(e) => handleUpdateTrgt(e, 'receiver')}
                    type="text" name="country_code" className="form-control" id="floatingInput" placeholder="">
                    {routes && [...new Set(routes.map(x => x.destinationCountryCode))].map((route, i) => (
                      <option key={i} value={route}>{countryListAllIsoData.find(item => item.value === route).label}</option>
                    ))}
                  </select>
                  <label for="floatingInput">Receiver address country code</label>
                </div>
                <div className="form-floating mb-1">
                  <select type="text" name="parcel_type" className="form-control" id="floatingInput" placeholder="">
                    <option value={'PARCEL'}>Parcel</option>
                  </select>
                  <label for="floatingInput">Parcel type</label>
                </div>
                {/* <label className="mt-2 mb-2 me-3">Customer type</label>
                <div className="form-check form-check-inline">
                  <input
                    onChange={handleUpdate}
                    checked={parcel.customer_type === "INDIVIDUAL"}
                    value="INDIVIDUAL" className="form-check-input" type="radio" name="customer_type" id="inlineRadio1" />
                  <label className="form-check-label" for="inlineRadio1">Individual</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    onChange={handleUpdate}
                    checked={parcel.customer_type === "CORPORATE"}
                    value="CORPORATE" className="form-check-input" type="radio" name="customer_type" id="inlineRadio2" />

                  <label className="form-check-label" for="inlineRadio2">Corporate</label>
                </div> */}
              </Tab>
              <Tab eventKey="details" title="Details">



                <div className="row g-3">
                  <div className="col-9">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={parcel.tracking_number}
                        onChange={handleUpdate}
                        type="text" name="tracking_number" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Tracking number</label>
                    </div>
                  </div>
                  <div className="col-3">
                    <button
                      onClick={() => setBarcodeScanner(true)}
                      type="submit" className="btn btn-primary btn-lg mb-3 p-3">Scan</button>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={parcel.weight}
                        onChange={handleUpdate}
                        type="text" name="weight" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Weight</label>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={parcel.item_price}
                        onChange={handleUpdate}
                        type="text" name="item_price" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Price</label>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={parcel.item_currency_code}
                        onChange={handleUpdate}
                        type="text" name="item_currency_code" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Currency</label>
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={parcel.description}
                        onChange={handleUpdate}
                        type="text" name="description" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Description</label>
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={parcel.notes}
                        onChange={handleUpdate}
                        type="text" name="notes" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Notes</label>
                    </div>
                  </div>
                </div>

                <span className="d-block mt-2 mb-2">Add new extra charge</span>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={extraChargeObj.note}
                        onChange={handleExtraItem}
                        type="text" name="note" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Note</label>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="form-floating mb-1 p-0">
                      <input
                        value={extraChargeObj.amount}
                        onChange={handleExtraItem}
                        type="text" name="amount" className="form-control" id="floatingInput" placeholder="" />
                      <label for="floatingInput">Amount</label>
                    </div>
                  </div>
                  <div className="col-3">
                    <button
                      onClick={addExtraItem}
                      className="btn btn-primary btn-lg p-3">Add</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <label className="mt-2 mb-2 me-3">Delivery option</label>
                    <div className="form-check form-check-inline">
                      <input
                        onChange={handleUpdate}
                        checked={parcel.collection_option === "HOME"}
                        value="HOME" className="form-check-input" type="radio" name="collection_option" id="inlineRadio1" />
                      <label className="form-check-label" for="inlineRadio1">Home</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        onChange={handleUpdate}
                        checked={parcel.collection_option === "OFFICE"}
                        value="OFFICE" className="form-check-input" type="radio" name="collection_option" id="inlineRadio2" />

                      <label className="form-check-label" for="inlineRadio2">Office</label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 p-3">
                    <div className="form-check form-check-inline">
                      <input
                        checked={parcel.packaging === 1}
                        onChange={(e) => setParcel({ ...parcel, [e.target.name]: 1 - parseInt(parcel.packaging) })}
                        name="packaging"
                        className="form-check-input" type="checkbox" id="inlineCheckbox1" />
                      <label className="form-check-label" for="inlineCheckbox1">Packaging</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        checked={parcel.min_price === 1}
                        onChange={(e) => setParcel({ ...parcel, [e.target.name]: 1 - parseInt(parcel.min_price) })}
                        name="min_price"
                        className="form-check-input" type="checkbox" id="inlineCheckbox2" />
                      <label className="form-check-label" for="inlineCheckbox2">Minimum price</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {showPrices && Object.keys(prices).map((key, i) => (
                    key !== 'currency_code' && (
                      <div className="col-6" key={i}>
                        <div className="alert alert-light p-1" style={{ fontSize: "15px" }} role="alert">
                          {key.replace('_', ' ')}: {prices[key]} {prices.currency_code}
                        </div>
                      </div>
                    )
                  ))}
                  {parcel.extra_charges.map((extraCharge, i) => (
                    <div className="col-6" key={i}>
                      <div className="alert alert-light p-1" style={{ fontSize: "15px" }} role="alert">
                        {extraCharge.note}: {extraCharge.amount}
                        <button
                          onClick={() => removeExtra(extraCharge)}
                          style={{ fontSize: "20px" }} className="btn p-0 float-end text-danger"><i className="bi bi-x"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  disabled={gettingCargoPrices || !showPrices}
                  className="btn btn-sm btn-warning mx-auto w-100" onClick={() => checkIfTrackingNumberIsFree()} >
                  {addingParcel ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Add"
                  )}
                </button>
              </Tab>
            </Tabs>


          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PickupForm;