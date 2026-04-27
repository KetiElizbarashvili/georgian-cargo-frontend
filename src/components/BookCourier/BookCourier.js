import React, { useState, useEffect, useContext, Fragment, useRef } from "react";
import "./multi-form.css";
import clientAddress from "requests/clientAddress";
import { useRequest } from 'hooks';
import Spinner from "react-bootstrap/Spinner";
import ClientFooter from 'components/Footer/ClientFooter';
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import saveBooking from "requests/saveBooking";
import { toast } from "react-toastify";
import { history } from "components/History";
import SourceFieldSet from "./SourceFieldSet";
import CourierVisitDate from "./CourierVisitDate";
import ParcelsCount from "./ParcelsCount";
import TermsAndConditions from "./TermsAndConditions";
import CollectionType from "./CollectionType";
import ParcelDeminsions from "./ParcelDeminsions";
import ReceiverDetails from "./ReceiverDetails";
import ClientNav from "components/ClientNav/ClientNav";
import EditAddressModal from "components/ClientAddress/EditAddressModal";
import countryListAllIsoData from 'utils/CountryList'
import getRoutes from "requests/getRoutes";
import newAddress from 'requests/newAddress';
import { AuthContext } from "context";
import Steps from "components/BookCourier/Steps";
// import ToBeDelivered from "./ToBeDelivered";
import Items from "./Items";
import clientReceivers from "requests/clientReceivers";
import parsePhoneNumber from 'libphonenumber-js'
import savePublicBooking from "requests/savePublicBooking";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const colors = [];

const bookItemObj = {
  item: {
    id: '',
    dimensions: '',
    weight: 0.00,
    value: '',
    details: ''
  },
  address: {
    id: '',
    name: '',
    email: '',
    phone: '',
    country_code: 'GE',
    line_1: '',
    line_2: '',
    postal_code: '',
  },
  to_be_delivered: 0,
  insurance: 0,
};


const BookCourier = ({ user }) => {
  const activeAddressRrceiversModal = useRef(null);
  const { sourcecountry, destinationCountry } = useParams();
  const [getClientAddress] = useRequest(clientAddress);
  const [activePanel, setActivePanel] = useState(null);
  const [finishedFieldSets, setFinishedFieldSets] = useState([]);
  const [saveBookingReq] = useRequest(saveBooking);
  const [savePublicBookingReq] = useRequest(savePublicBooking);
  const [clientReceiversReq] = useRequest(clientReceivers);
  const [getRoutesData] = useRequest(getRoutes);
  const [filteredCountryList, setFilteredCountryList] = useState([]);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [newAddressReq] = useRequest(newAddress);
  const [addresses, setAddresses] = useState(null);
  const { auth, setAuth } = useContext(AuthContext);
  const [gotAddress, setGotAddress] = useState(false);
  const [checkedAddress, setCheckedAddress] = useState('default');
  const [addressIsSaving, setAddressIsSaving] = useState(false);
  const [receiversStart, setReceiversStart] = useState(0);
  const [receiversCountryCode, setReceiversCountryCode] = useState('GE');
  const [addressReceivers, setAddressReceivers] = useState([]);
  const [addressReceiversLoading, setAddressReceiversLoading] = useState(false);
  const [bookingNextStepping, setBookingNextStepping] = useState(false);
  const [scrollStepsVal, setScrollStepsVal] = useState(0);
  const [book, setBook] = useState({
    source_country: sourcecountry,
    source_address: '',
    visit_date: (new Date().toISOString().slice(0, 19).replace('T', ' ')),
    parcels_count: '1',
    drop_off: 0,
    home_collection: 0,
    address_type: 'default',
    address_obj: {
      name: '',
      email: '',
      phone: '',
      address_postal_code: '',
      address_line_1: '',
      address_line_2: '',
      address_country_code: ''
    },
    items: [],
  });

  const [bookError, setBookError] = useState(null);
  const [loading, setLoading] = useState(true);

  const openEditAddressModal = () => {
    setShowEditAddressModal(true);
  };

  useEffect(() => {
    for (let i = 0; i < 100; i++) {
      colors.push(Math.floor(Math.random() * 16777215).toString(16));
    }
    setReceiversCountryCode(destinationCountry);
  }, []);

  const getAddressReceivers = (b) => {
    setAddressReceiversLoading(true);
    clientReceiversReq({ country_code: receiversCountryCode })
      .then((response) => {
        setAddressReceivers(response?.data?.receivers || []);
        setAddressReceiversLoading(false);
      });
  };

  useEffect(() => {
    getAddressReceivers(false);
  }, [receiversStart]);

  useEffect(() => {
    setBook({ ...book, source_country: sourcecountry, source_address: addresses });
  }, [addresses]);

  useEffect(() => {
    // console.log(book);
  }, [book]);

  const scrollStepsList = (by) => {
    document.getElementsByClassName('horizontal-slide')[0]?.scrollTo({
      left: by === '-' ? scrollStepsVal - 100 : scrollStepsVal + 100,
      behavior: 'smooth',
    });
  };


  const proceedPrevFieldSet = () => {
    let scrlVal = scrollStepsVal;
    setScrollStepsVal(scrlVal - 100);
    scrollStepsList('-');
    // let activ = document.getElementsByClassName('activ');
    // activ[0]?.scrollIntoView({ behavior: "smooth", block: 'nearest' });
    let prev = (parseInt(Steps[book.source_country.toLowerCase()].map(function (e) { return e.item; }).indexOf(activePanel)) - 1);

    if (Steps[book.source_country.toLowerCase()][prev] !== undefined) {
      setActivePanel(Steps[book.source_country.toLowerCase()][prev].item);
    }
    window.scrollTo(0, 0);
  };

  const proceedNextFieldSet = (data) => {
    let scrlVal = scrollStepsVal;
    setScrollStepsVal(scrlVal + 100);
    scrollStepsList('+');
    let next = (1 + parseInt(Steps[book.source_country.toLowerCase()].map(function (e) { return e.item; }).indexOf(activePanel)));
    let missing = Steps[book.source_country.toLowerCase()].filter(function (v) {
      return !finishedFieldSets.includes(v.item);
    })[0];

    if (Steps[book.source_country.toLowerCase()][next] !== undefined) {
      setActivePanel(Steps[book.source_country.toLowerCase()][next].item);
      setFinishedFieldSets(finishedFieldSets => [...finishedFieldSets, activePanel]);
    }
    else if (finishedFieldSets.length === (Steps[book.source_country.toLowerCase()].length - 1) || missing.item === 'TermsAndConditions') {
      SaveBooking();
    }
    else {

      document.getElementById(missing.item).classList.add('btn-danger');
      document.getElementById(missing.item).classList.add('text-white');
    }
    window.scrollTo(0, 0);
  };

  const updateAddress = (addr) => {
    handleNewAddress();
  };


  const handleNewAddress = () => {
    setAddressIsSaving(true);
    newAddressReq(addresses)
      .then((response) => {
        if (response.data.error === true) {
          toast.error(response.data.message, toastOptions);
        }
        else {
          let addr = response.data.address;
          closeEditAddressModal();
          setAddresses(addr);
          toast.success("Address saved!", toastOptions);
          setGotAddress(true);
        }
        setAddressIsSaving(false);
      }).catch((e) => {
        toast.error("An error occurred");
        setAddressIsSaving(false);
      });
  };

  const closeEditAddressModal = () => {
    setShowEditAddressModal(false);
  };

  const onTodoChange = (index, value) => {
    setAddresses({ ...addresses, [index]: value });
  };



  const SaveBooking = () => {
    // console.log(book); return;
    setBookingNextStepping(true);
    if (auth?.isLoggedIn) {
      saveBookingReq(book).
        then((response) => {
          if (response.data.error === true) {
            toast.error(response.data.message, toastOptions);
          }
          else {
            // console.log(book);
            history.push("/dashboard/bookings");
            toast.success("Booking created successfully!", toastOptions);
          }
          setBookingNextStepping(false);
        }).catch((e) => {
          toast.error("An error occurred");
          setBookingNextStepping(false);
        });
    }
    else {
      savePublicBookingReq(book).
        then((response) => {
          if (response.data.error === true) {
            toast.error(response.data.message, toastOptions);
          }
          else {
            // console.log(book);
            history.push("/");
            // console.log(response);

            toast.success("Booking created successfully! We will create account with your email if it does not exists, then we will send you verification link", { ...toastOptions, autoClose: 10000 });
          }
          setBookingNextStepping(false);
        }).catch((e) => {
          toast.error("An error occurred");
          setBookingNextStepping(false);
        });
    }

  };

  const updateBook = (key, val) => {
    setBook({ ...book, [key]: val });
  };


  const StartBookingProcess = () => {
    setLoading(true);
    setBookError(null);
    if (auth?.isLoggedIn) {
      getClientAddress()
        .then((response) => {
          getRoutesData()
            .then((response) => {
              setFilteredCountryList(countryListAllIsoData.filter(obj => {
                return response.data.routes.map(a => a.code).includes(obj.value)
              }));
            });
          if (response.data.addresses?.length === 0) {
            setAddresses({ name: auth.staff.name, email: auth.staff.email, phone: auth.staff.phone, address_country_code: sourcecountry, address_line_1: '', address_line_2: '', address_postal_code: '' });
            setCheckedAddress('custom');
          }
          else if (response.data.addresses[0]?.address_country_code === sourcecountry) {
            setAddresses({ name: auth.staff.name, email: auth.staff.email, phone: auth.staff.phone, address_country_code: sourcecountry, address_line_1: response.data.addresses[0].address_line_1, address_line_2: response.data.addresses[0].address_line_2, address_postal_code: response.data.addresses[0].address_postal_code });
          }
          else {
            /////////
            setAddresses({ name: auth.staff.name, email: auth.staff.email, phone: auth.staff.phone, address_country_code: sourcecountry, address_line_1: '', address_line_2: '', address_postal_code: '' });
          }
          console.log(parsePhoneNumber('+' + auth.staff.phone));
          // return;
          if (parsePhoneNumber('+' + auth.staff.phone) !== undefined && parsePhoneNumber('+' + auth.staff.phone).country !== undefined && parsePhoneNumber('+' + auth.staff.phone).country.replace('GB', 'UK') !== sourcecountry) {
            let cntr = parsePhoneNumber('+' + auth.staff.phone).country.replace('GB', 'UK');
            history.push("/dashboard/personal-info");
            toast.error(`You are booking from ${sourcecountry} but your phone number is set to ${cntr}. Please change it to ${sourcecountry} phone number. you need to change country code.`, { ...toastOptions, autoClose: 15000 });
          } else if (parsePhoneNumber('+' + auth.staff.phone)?.country === undefined) {
            toast.error('Your phone number seems to be invalid. please make sure it is correct by checking if you have included country code. for example: Georgia phone code is 995, so phone number example will be 995555123456. change it in personal info page.', { ...toastOptions, autoClose: 20000 });
          }

          setActivePanel(Steps[sourcecountry.toLowerCase()][0].item);
          // }
          // else {
          //   console.log(response.data.addresses);
          //   setBook({ ...book, source_country: response.data.addresses[0].address_country_code, source_address: response.data.addresses[0] });
          //   setActivePanel(Steps[response.data.addresses[0].address_country_code.toLowerCase()][0].item);
          // }

          if (Object.keys(Steps).length === 0) {
            setBookError(
              <Fragment>
                Currently we do not have booking.
                {/* You do not have address. please <Link className="text-info" onClick={() => openEditAddressModal()}>create address</Link>. */}
              </Fragment>
            );
          }
          // else if (steps[response.data.addresses[0].address_country_code.toLowerCase()] === undefined) {
          //   setBookError(
          //     <Fragment>
          //       Sorry. Currently we don't have courier booking function for your address Country.
          //     </Fragment>
          //   );
          // }
          setLoading(false);
        });
    }
    else {
      setCheckedAddress('custom');
      setActivePanel(Steps[sourcecountry.toLowerCase()][0].item);
      setLoading(false);
    }

  };

  useEffect(() => {
    if (!Object.keys(Steps).includes(sourcecountry.toLowerCase())) {
      window.location.href = "/404";
    }
    StartBookingProcess();
  }, [gotAddress, sourcecountry]);

  return (
    <>
      <main id="content" className="mt-lg-0 mt-xl-8 mt-xxl-8" style={{ minWidth: "308px" }}>

        <div className="container" id="grad1">
          <div className="row mt-0">
            {auth?.isLoggedIn && (
              <div className="col-md-3 col-sm-2 col-12 mb-4" style={{ minWidth: "50px" }}>
                <ClientNav user={user} />
              </div>
            )}
            {!loading && null !== bookError && (
              <div className="col-md-9 col-sm-10 col-10">
                <div className="card text-white bg-warning mb-3 mt-4 w-100">
                  <div className="card-body">
                    <h5 className="card-title">Warning</h5>
                    <p className="card-text">{bookError}</p>
                  </div>
                </div>
              </div>
            )}
            {loading && (
              <div className="col-md-9 col-sm-10 col-10">
                <div className="d-flex justify-content-center align-items-center m-10">
                  <Spinner animation="border" size="sm" />
                </div>
              </div>
            )}

            {!loading && null === bookError && (
              <div className={auth?.isLoggedIn ? "col-md-9 col-sm-10 col-12 mt-n4" : "col-12 mt-n4"}>
                <ul class="horizontal-slide text-center mt-2 mb-2">
                  {Steps[book.source_country.toLowerCase()].map((stepItem, i) => (
                    <>
                      <li className={"me-2 span2 " + ((activePanel === stepItem.item && !finishedFieldSets.includes(stepItem.item)) ? 'activ' : '')} key={i} style={{ position: "realtive", zIndex: "10" }}>
                        <button
                          id={stepItem.item}
                          className={"btn btn-outline-dark p-2 "
                            + (activePanel === stepItem.item ? ' ' : '')
                            + (finishedFieldSets.includes(stepItem.item) ? ' btn-success' : '')}

                          onClick={() => setActivePanel(stepItem.item)}>{stepItem.label} &nbsp;

                          {(activePanel === stepItem.item && !finishedFieldSets.includes(stepItem.item)) && (
                            <i className="fas fa-spinner fa-spin"></i>

                          )}
                          {finishedFieldSets.includes(stepItem.item) && (
                            <i className="bi bi-check"></i>
                          )}
                        </button>
                      </li>
                      {/* {stepItem.item !== 'TermsAndConditions' && (
                        <li className="span2">
                          <i className="bi bi-arrow-right-short d-block mt-1 ms-1" style={{ fontSize: "25px" }}></i>
                        </li>
                      )} */}
                    </>
                  ))}
                </ul>
                {/* <ul className="nav justify-content-center mt-4">
                  {Steps[book.source_country.toLowerCase()].map((stepItem, i) => (
                    <>
                      <li className="nav-item mb-2" key={i} style={{ position: "realtive", zIndex: "10" }}>
                        <button
                          id={stepItem.item}
                          className={"btn btn-outline-dark p-2 "
                            + (activePanel === stepItem.item ? ' ' : '')
                            + (finishedFieldSets.includes(stepItem.item) ? ' btn-success' : '')}

                          onClick={() => setActivePanel(stepItem.item)}>{stepItem.label} &nbsp;

                          {(activePanel === stepItem.item && !finishedFieldSets.includes(stepItem.item)) && (
                            <i className="fas fa-spinner fa-spin"></i>

                          )}
                          {finishedFieldSets.includes(stepItem.item) && (
                            <i className="bi bi-check"></i>
                          )}
                        </button>
                      </li>
                      {stepItem.item !== 'TermsAndConditions' && (
                        <li>
                          <i className="bi bi-arrow-right-short d-block mt-1 ms-1" style={{ fontSize: "25px" }}></i>
                        </li>
                      )}
                    </>
                  ))}
                </ul> */}

                <div className="row">
                  {activePanel !== 'SourceFieldSet' && (
                    <div className="col-1 ps-0" style={{ marginTop: "150px" }}>
                      <button className="float-start btn btn-secondary btn-sm" onClick={proceedPrevFieldSet}><i className="bi bi-arrow-left-short" style={{ fontSize: "18px" }}
                      ></i> <span className="d-none d-sm-none d-md-block d-lg-block">Back</span></button>
                    </div>
                  )}
                  {(activePanel === 'CourierVisitDate') && (
                    <>
                      <CourierVisitDate
                        book={book}
                        proceedNextFieldSet={proceedNextFieldSet}
                        updateBook={updateBook}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        componentName={activePanel}
                        setBook={setBook}
                        bookItemObj={bookItemObj}

                      />
                    </>
                  )}

                  {(activePanel === 'ParcelsCount') && (
                    <>
                      <ParcelsCount
                        book={book}
                        setBook={setBook}
                        bookItemObj={bookItemObj}
                        proceedNextFieldSet={proceedNextFieldSet}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        updateBook={updateBook}
                        componentName={activePanel}
                      />
                    </>
                  )}

                  {(activePanel === 'SourceFieldSet') && (
                    <>
                      <SourceFieldSet
                        book={book}
                        proceedNextFieldSet={proceedNextFieldSet}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        updateBook={updateBook}
                        setBook={setBook}
                        setCheckedAddress={setCheckedAddress}
                        checkedAddress={checkedAddress}
                        openEditAddressModal={openEditAddressModal}
                        steps={Steps}
                        componentName={activePanel}
                      />
                    </>
                  )}



                  {(activePanel === 'TermsAndConditions') && (
                    <>
                      <TermsAndConditions
                        book={book}
                        proceedNextFieldSet={proceedNextFieldSet}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        updateBook={updateBook}
                        bookingNextStepping={bookingNextStepping}
                        componentName={activePanel}
                      />
                    </>
                  )}

                  {(activePanel === 'ParcelDeminsions') && (
                    <>
                      <ParcelDeminsions
                        book={book}
                        proceedNextFieldSet={proceedNextFieldSet}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        updateBook={updateBook}
                        componentName={activePanel}
                      />
                    </>
                  )}

                  {(activePanel === 'ReceiverDetails') && (
                    <>
                      <ReceiverDetails
                        book={book}
                        proceedNextFieldSet={proceedNextFieldSet}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        updateBook={updateBook}
                        componentName={activePanel}
                      />
                    </>
                  )}
                  {(activePanel === 'CollectionType') && (
                    <>
                      <CollectionType
                        book={book}
                        setBook={setBook}
                        proceedNextFieldSet={proceedNextFieldSet}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        componentName={activePanel}
                      />
                    </>
                  )}
                  {(activePanel === 'Items') && (
                    <>
                      <Items
                        colors={colors}
                        book={book}
                        setBook={setBook}
                        bookItemObj={bookItemObj}
                        proceedNextFieldSet={proceedNextFieldSet}
                        proceedPrevFieldSet={proceedPrevFieldSet}
                        updateBook={updateBook}
                        componentName={activePanel}
                        addressReceivers={addressReceivers}
                        setReceiversStart={setReceiversStart}
                        receiversStart={receiversStart}
                        addressReceiversLoading={addressReceiversLoading}
                        setReceiversCountryCode={setReceiversCountryCode}
                      />
                    </>
                  )}


                </div>

              </div>

            )}
          </div>
        </div>
        <ClientFooter />
      </main>
      {addresses && (
        <EditAddressModal
          addresses={addresses}
          showEditAddressModal={showEditAddressModal}
          closeEditAddressModal={closeEditAddressModal}
          filteredCountryList={filteredCountryList}
          onTodoChange={onTodoChange}
          updateAddress={updateAddress}
          openEditAddressModal={openEditAddressModal}
          addressIsSaving={addressIsSaving}
        />
      )}

    </>
  );
};

export default BookCourier;