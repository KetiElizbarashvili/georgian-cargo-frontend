import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import countryListAllIsoData from 'utils/CountryList'
import getRoutes from "requests/getRoutes";
import { useRequest } from 'hooks';
import Select from 'react-select';
import BookStepButtons from "./BookStepButtons";
import { AuthContext } from "context";

const SourceFieldSet = ({ book, proceedNextFieldSet, proceedPrevFieldSet, componentName, updateBook, setBook, setCheckedAddress, checkedAddress, openEditAddressModal, steps }) => {
  const { register, control, handleSubmit, trigger, formState: { errors } } = useForm();
  const [customAddress, setCustomAddress] = useState({ address_line_1: '', address_line_2: '', address_postal_code: '' });
  const [filteredCountryList, setFilteredCountryList] = useState([]);
  const [getRoutesData] = useRequest(getRoutes);
  const errorsDiv = document.getElementById("source-form-errors");
  const { auth, setAuth } = useContext(AuthContext);

  const handleAddress = () => {
    if (checkedAddress === 'default') {
      console.log(book.source_address);
      if (book.source_address !== null && book.source_address.address_line_1 !== '') {
        proceedNextFieldSet();
      }
      else {
        errorsDiv.classList.remove("d-none");
        errorsDiv.innerHTML = "Please create new address for this Country or enter different address.";
      }
    }
    else {
      errorsDiv.classList.add("d-none");
      handleSubmit(proceedNextFieldSet)();
    }
  };

  useEffect(() => {
    getRoutesData()
      .then((response) => {
        setFilteredCountryList(countryListAllIsoData.filter(obj => {
          return response.data.routes.map(a => a.code).includes(obj.value)
        }));
      });

  }, []);



  useEffect(() => {
    setBook({ ...book, address_type: checkedAddress });
  }, [checkedAddress]);

  const onTodoChange = (index, value) => {
    if (checkedAddress === 'default') {
      setCheckedAddress('custom');
    }
    else {
      setBook(book => ({
        ...book,
        address_obj: { ...book.address_obj, address_country_code: book.source_country }
      }));
    }
    // setCustomAddress({...customAddress, [index]: value});
    // setBook({address_obj: {...book.address_obj, address_postal_code: value}});
    setBook(book => ({
      ...book,
      address_obj: { ...book.address_obj, [index]: value }
    }));
  };

  return (
    <>
      <div className="col-1 ps-0" style={{ marginTop: "150px" }}>
        <button className="float-start btn btn-secondary btn-sm disabled" onClick={proceedPrevFieldSet}><i className="bi bi-arrow-left-short" style={{ fontSize: "18px" }}
        ></i> <span className="d-none d-sm-none d-md-block d-lg-block">Back</span></button>
      </div>
      <div className="col-10">
        <fieldset>
          <div className="card text-center">
            <div className="card-header text-white bg-primary text-start d-inline-block w-100 p-3">
              <a data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                <div className="row">
                  <div className="col-10">
                    <h4 className="text-white d-block w-100">Collection address <img
                      className=""
                      src={"https://flagcdn.com/w160/" + (book.source_country.toLowerCase() == 'uk' ? 'gb' : book.source_country.toLowerCase()) + ".png"}
                      srcSet={"https://flagcdn.com/w160/" + (book.source_country.toLowerCase() == 'uk' ? 'gb' : book.source_country.toLowerCase()) + ".png 2x"}
                      width="32"
                      alt="UK" />
                    </h4>
                  </div>
                  <div className="col-1">
                    <i className="bi bi-chevron-double-down float-end text-dark"></i>
                  </div>
                </div>
              </a>
              <div class="collapse" id="collapseExample">
                <small className="text-white float-start">
                  We found your address is located in {book.source_country}.

                  <br />
                  if you want to use differect source address, please go to your dashboard and change <Link className="text-secondary" to="/dashboard/address">current address</Link> or enter different address on this page.
                </small>
              </div>

            </div>
            <div className="card-body mb-0 pt-0 pb-1 ps-2 pe-2">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                {auth?.isLoggedIn && (
                  <li className="nav-item" role="presentation">
                    <button
                      onClick={() => setCheckedAddress('default')}
                      className={"nav-link p-1 " + (checkedAddress === 'default' ? 'active' : '')} id="default-tab" data-bs-toggle="tab" data-bs-target="#default" type="button" role="tab" aria-controls="default" aria-selected="true">Default Address</button>
                  </li>
                )}
                <li className="nav-item" role="presentation">
                  <button
                    onClick={() => setCheckedAddress('custom')}
                    className={"nav-link p-1 " + (checkedAddress === 'custom' ? 'active' : '')} id="enteraddress-tab" data-bs-toggle="tab" data-bs-target="#enteraddress" type="button" role="tab" aria-controls="enteraddress" aria-selected="false">Enter Address</button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div className={"tab-pane fade " + (checkedAddress === 'default' ? "show active" : '')} id="default" role="tabpanel" aria-labelledby="default-tab">
                  <div className={"card mx-auto col-md-5 col-sm-12 mb-2 mt-2 border " + (checkedAddress === 'default' ? 'border-success' : '')}>
                    {/* <div className="card-header">
                  <input className="form-check-input" type="checkbox" id="flexCheckDefault" style={{ zoom: "2", marginLeft: "1px" }}
                    checked={checkedAddress === 'default'}
                    onChange={() => setCheckedAddress('default')}
                  />
                  <span className="ms-6 pt-2">Default Address</span>
                </div> */}
                    {(book.source_address === null || book.source_address.address_line_1 === '') && (
                      <button className="btn btn-secondary  btn-sm my-auto"
                        onClick={() => openEditAddressModal()}
                      >Create new Address</button>
                    )}

                    {book.source_address !== null && book.source_address.address_line_1 !== '' && (
                      <div className="card-body text-dark">
                        <p className="card-text text-start">
                          <b>Country:&nbsp;</b> {book.source_country} <br />
                          <b>Address line 1:&nbsp;</b> {book.source_address.address_line_1} <br />
                          <b>Address line 2:&nbsp;</b> {book.source_address.address_line_2} <br />
                          <b>Postal code:&nbsp;</b> {book.source_address.address_postal_code} <br />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className={"tab-pane fade " + (checkedAddress === 'custom' ? "show active" : '')} id="enteraddress" role="tabpanel" aria-labelledby="enteraddress-tab">
                  <div className={"card mt-2 mb-2 col-md-6 col-sm-12 border mx-auto " + (checkedAddress === 'custom' ? 'border-success' : '')}>
                    {/* <div className="card-header">
                  <input className="form-check-input" type="checkbox" id="flexCheckDefault" style={{ zoom: "2", marginLeft: "1px" }}
                    checked={checkedAddress === 'custom'}
                    onChange={() => setCheckedAddress('custom')}
                  />
                  <span className="ms-6 pt-2">Enter different address</span>
                </div> */}
                    <div className="card-body text-dark text-start">





                      <form>
                        <div style={{ whiteSpace: "pre" }} id="form-errors" className="alert alert-danger d-none" role="alert">
                        </div>
                        <div className="row">
                          {/* <label htmlFor="locationLabel" className="col-sm-3 col-form-label form-label">Location</label> */}

                          <div className="col-sm-12">
                            <div className={"tom-select-custom mb-3"}>
                              <Controller
                                control={control}
                                className={"form-control form-control-sm"}
                                name="address_country_code"
                                defaultValue={book.source_country}
                                render={({ field: { onChange, value, name, ref } }) => (
                                  <Select
                                    isDisabled={true}
                                    // {...register("address_country_code", { required: true, maxLength: 255})}
                                    inputRef={ref}
                                    classNamePrefix="addl-class"
                                    options={filteredCountryList}
                                    value={filteredCountryList.find((c) => c.value === book.source_country)}
                                    onChange={(e) =>
                                      onTodoChange('address_country_code', e.value)
                                    }
                                  />
                                )}
                              />
                              {errors.address_country_code && <p className="text-danger d-block w-full">Please check the Address country code</p>}
                            </div>
                          </div>


                        </div>

                        <div className="row mb-2">
                          {/* <label htmlFor="AddressLine1" className="col-sm-3 col-form-label form-label">Address line 1</label> */}

                          <div className="col-sm-12">
                            <input type="text"
                              className={"form-control form-control-sm " + (errors.name ? 'border rounded border-danger' : '')}
                              name="name"
                              value={book.address_obj.name}
                              {...register("name", {
                                required: {
                                  value: true,
                                  message: "This field is required"
                                },
                                maxLength: {
                                  value: 255,
                                  message: "Too Many Characters. maximum: 255"
                                }
                              })}
                              onChange={e => onTodoChange('name', e.target.value)}
                              id="FullName" placeholder="Full name" aria-label="Full name"
                            />
                            {errors.name?.message && <p className="text-danger d-block w-full">{errors.name?.message}</p>}

                          </div>
                        </div>

                        <div className="row mb-2">
                          {/* <label htmlFor="AddressLine1" className="col-sm-3 col-form-label form-label">Address line 1</label> */}

                          <div className="col-sm-12">
                            <input type="text"
                              className={"form-control form-control-sm " + (errors.email ? 'border rounded border-danger' : '')}
                              name="email"
                              value={book.address_obj.email}
                              {...register("email", {
                                required: {
                                  value: true,
                                  message: "This field is required"
                                },
                                maxLength: {
                                  value: 255,
                                  message: "Too Many Characters. maximum: 255"
                                },
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "invalid email address"
                                }
                              })}
                              onChange={e => onTodoChange('email', e.target.value)}
                              id="Email" placeholder="Email" aria-label="Email"
                            />
                            {errors.email?.message && <p className="text-danger d-block w-full">{errors.email?.message}</p>}

                          </div>
                        </div>

                        <div className="row mb-2">
                          {/* <label htmlFor="AddressLine1" className="col-sm-3 col-form-label form-label">Address line 1</label> */}

                          <div className="col-sm-12">
                            <input type="text"
                              className={"form-control form-control-sm " + (errors.email ? 'border rounded border-danger' : '')}
                              name="phone"
                              value={book.address_obj.phone}
                              {...register("phone", {
                                required: {
                                  value: true,
                                  message: "This field is required"
                                },
                                maxLength: {
                                  value: 255,
                                  message: "Too Many Characters. maximum: 255"
                                }
                              })}
                              onChange={e => onTodoChange('phone', e.target.value)}
                              id="Phone" placeholder="Phone" aria-label="Phone"
                            />
                            {errors.phone?.message && <p className="text-danger d-block w-full">{errors.phone?.message}</p>}

                          </div>
                        </div>

                        <div className="row mb-2">
                          {/* <label htmlFor="AddressLine1" className="col-sm-3 col-form-label form-label">Address line 1</label> */}

                          <div className="col-sm-12">
                            <input type="text"
                              className={"form-control form-control-sm " + (errors.address_line_1 ? 'border rounded border-danger' : '')}
                              name="address_line_1"
                              value={book.address_obj.address_line_1}
                              {...register("address_line_1", {
                                required: {
                                  value: true,
                                  message: "This field is required"
                                },
                                maxLength: {
                                  value: 255,
                                  message: "Too Many Characters. maximum: 255"
                                }
                              })}
                              onChange={e => onTodoChange('address_line_1', e.target.value)}
                              id="AddressLine1" placeholder="Address Line 1" aria-label="Address Line 1"
                            />
                            {errors.address_line_1?.message && <p className="text-danger d-block w-full">{errors.address_line_1?.message}</p>}

                          </div>
                        </div>

                        <div className="row mb-2">
                          {/* <label htmlFor="AddressLine2" className="col-sm-3 col-form-label form-label">Address line 2</label> */}

                          <div className="col-sm-12">
                            <input type="text"
                              value={book.address_obj.address_line_2}
                              className={"form-control form-control-sm " + (errors.address_line_2 ? 'border rounded border-danger' : '')}
                              name="address_line_2"
                              {...register("address_line_2", {
                                maxLength: {
                                  value: 255,
                                  message: "Too Many Characters. maximum: 255"
                                }
                              })}
                              onChange={e => onTodoChange('address_line_2', e.target.value)}
                              id="AddressLine1" placeholder="Address Line 2" aria-label="Address Line 2"
                            />
                            {errors.address_line_2?.message && <p className="text-danger d-block w-full">{errors.address_line_2?.message}</p>}

                            {/* {errors.address_line_2 && <p className="text-danger d-block w-full">Please check Address line 2</p>} */}

                          </div>
                        </div>

                        <div className="row mb-2">

                          {/* <label htmlFor="PostalCode" className="col-sm-3 col-form-label form-label">Postal code</label> */}

                          <div className="col-sm-12">
                            <input type="text"
                              className={"form-control form-control-sm " + (errors.address_postal_code ? 'border rounded border-danger' : '')}
                              name="address_postal_code"
                              value={book.address_obj.address_postal_code}
                              {...register("address_postal_code", {
                                required: {
                                  value: true,
                                  message: "This field is required"
                                },
                                maxLength: {
                                  value: 255,
                                  message: "Too Many Characters. maximum: 255"
                                }
                              })}
                              onChange={e => onTodoChange('address_postal_code', e.target.value)}
                              id="PostalCode" placeholder="Postal Code" aria-label="Postal Code"
                            />
                            {errors.address_postal_code?.message && <p className="text-danger d-block w-full">{errors.address_postal_code?.message}</p>}
                          </div>
                        </div>

                      </form>

                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-12">

                  <div style={{ whiteSpace: "pre" }} id="source-form-errors" className="alert alert-danger d-none" role="alert">
                  </div>
                  <div className="row mx-auto">


                  </div>
                </div>
              </div>
            </div>
            {/* <BookStepButtons
          handleSubmit={handleSubmit}
          proceedNextFieldSet={handleAddress}
          proceedPrevFieldSet={proceedPrevFieldSet}
          componentName={componentName}
        /> */}
            {/* <div className="span2 pb-4 text-end me-4">
              <button className="btn btn-success  btn-sm" onClick={() => handleAddress()}>Next <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
              ></i></button>
            </div> */}
          </div>
        </fieldset>
      </div>
      <div className="col-1 ps-0 ms-n3 ms-lg-0 me-lg-n6" style={{ marginTop: "150px" }}>
        <button className="btn btn-success btn-sm" onClick={() => handleAddress()}><span className="d-none d-sm-none d-md-block d-lg-block">Next</span> <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
        ></i></button>
      </div>
    </>
  );
};

export default SourceFieldSet;