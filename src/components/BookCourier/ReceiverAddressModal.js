import React, { useState, useEffect, useContext, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm, Controller, useFormContext } from "react-hook-form";
import Select from 'react-select';
import ClientAddressCard from "components/ClientAddress/ClientAddressCard";
import Spinner from "react-bootstrap/Spinner";
import Autosuggest from 'react-autosuggest';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

const renderSuggestion = (suggestion) => {
  return (
    <div role="button" className="text-black"
      style={{ zIndex: "99" }}>
      {suggestion.name}
    </div>
  );
};

const ReceiverAddressModal = ({ destinationCountry, itemObj, setItemObj, onTodoChange, closeEditReceiverAddressModal, openEditReceiverAddressModal, itemIsSaving, showEditReceiverAddressModal, filteredCountryList, addressReceivers, setReceiversStart, receiversStart, addressReceiversLoading, activeAddressRrceiversModal, saveItemAddress, chooseAddressFromHistory, setReceiversCountryCode, activeItemId }) => {

  const listInnerRef = useRef();
  const { setValue, reset, register, trigger, control, handleSubmit, formState: { errors } } = useForm();
  const [suggestions, setSuggestions] = useState([]);
  // const [value, setValue] = useState('');

  function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  useEffect(() => {
    register('name', {
      required: {
        value: true,
        message: "This field is required"
      },
      maxLength: {
        value: 255,
        message: "Too Many Characters. maximum: 255"
      }
    });
  }, []);

  const getSuggestionValue = (suggestion) => {
    setItemObj(prevObj => ({
      ...prevObj,
      address: {
        id: suggestion.id,
        name: suggestion.name,
        phone: suggestion.phone,
        email: suggestion.email,
        country_code: suggestion.address_country_code,
        line_1: suggestion.address_line_1,
        line_2: suggestion.address_line_2,
        postal_code: suggestion.address_postal_code
      }
    }));
    setValue("name", suggestion.name);
    setValue("phone", suggestion.phone);
    setValue("email", suggestion.email);
    setValue("address_country_code", suggestion.address_country_code);
    setValue("address_line_1", suggestion.address_line_1);
    setValue("address_line_2", suggestion.address_line_2);
    setValue("address_postal_code", suggestion.address_postal_code);

    handleSubmit();
    handleSubmit();
    handleSubmit();
    return suggestion.name;
  };

  const getSuggestions = (value) => {

    const escapedValue = escapeRegexCharacters(value.toString().trim());
    const regex = new RegExp('^' + escapedValue, 'i');

    return addressReceivers.filter(sug => regex.test(sug.name));

  };

  const onChangeName = (event, { newValue }) => {
    setValue(newValue);
    setValue("name", newValue);
    onTodoChange('address.name', newValue);
    trigger();
  };

  const inputProps = {
    placeholder: 'Receiver name',
    value: itemObj?.address.name,
    onChange: onChangeName,
    className: "form-control form-control-sm " + (errors.name ? 'border rounded border-danger' : ''),
    //   {...register("name", {
    //     required: {
    //       value: true,
    //       message: "This field is required"
    //     },
    //     maxLength: {
    //       value: 255,
    //       message: "Too Many Characters. maximum: 255"
    //     }
    //   })
    // }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions(getSuggestions([]));
  };

  useEffect(() => {
    if (showEditReceiverAddressModal) {
      setValue("name", '');
      setValue("phone", '');
      setValue("email", '');
      setValue("address_country_code", destinationCountry);
      setValue("address_line_1", '');
      setValue("address_line_2", '');
      setValue("address_postal_code", '');
    }
  }, [showEditReceiverAddressModal]);
  // const onScroll = () => {
  //   if (listInnerRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
  //     if (scrollTop + clientHeight === scrollHeight) {
  //       setReceiversStart(receiversStart + 6);
  //     }
  //   }
  // };

  return (

    <Modal
      size="md"
      onHide={closeEditReceiverAddressModal}
      show={showEditReceiverAddressModal}
      aria-labelledby="enter-receiver-address"
      centered
    >
      <Modal.Header closeButton
        className="pt-1 pb-1">
        <Modal.Title id="create-route-title" className="">Enter receiver address for Item: {activeItemId}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0 pb-1">
        <>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <form id="receiver-address-form">
                <div style={{ whiteSpace: "pre" }} id="form-errors" className="alert alert-danger d-none" role="alert">
                </div>
                <div className="row mb-1">
                  <label htmlFor="locationLabel" className="col-sm-3 col-form-label form-label pt-0 pb-0">Location</label>

                  <div className="col-sm-9">
                    <div className={"tom-select-custom"}>
                      <Controller
                        control={control}
                        className={"form-control form-control-sm"}
                        name="address_country_code"
                        defaultValue={itemObj?.address.country_code}
                        render={({ field: { onChange, value, name, ref } }) => (
                          <Select
                            {...register("address_country_code", {
                              required: {
                                value: true,
                                message: "This field is required"
                              }
                            })}
                            inputRef={ref}
                            classNamePrefix="addl-class"
                            options={filteredCountryList}
                            value={filteredCountryList.find((c) => c.value === itemObj?.address.country_code)}
                            onChange={(e) => {
                              onTodoChange('address.country_code', e.value);
                              setReceiversCountryCode(e.value.toUpperCase());
                              setValue("address_country_code", e.value);
                            }
                            }
                          />
                        )}
                      />
                      {errors.address_country_code?.message && <p className="text-danger d-block w-full">{errors.address_country_code?.message}</p>}

                    </div>
                  </div>


                </div>

                <div className="row mb-1">
                  <label htmlFor="name" className="col-sm-3 col-form-label form-label pt-0 pb-0">Name</label>

                  <div className="col-sm-9">
                    <Autosuggest
                      suggestions={suggestions}
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSuggestionsClearRequested}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputProps}
                    />
                    {/* <Controller
                      as={
                        <Autosuggest
                          suggestions={suggestions}
                          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                          onSuggestionsClearRequested={onSuggestionsClearRequested}
                          getSuggestionValue={getSuggestionValue}
                          renderSuggestion={renderSuggestion}
                          inputProps={inputProps}
                        />
                      }
                      control={control}
                      name={"name"}
                    /> */}

                    {/* <input type="text"
                      className={"form-control form-control-sm " + (errors.name ? 'border rounded border-danger' : '')}
                      name="name"
                      value={itemObj.address.name}
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
                      onChange={e => onTodoChange('address.name', e.target.value)}
                      id="name" placeholder="Name" aria-label="Name"
                    /> */}
                    {errors.name?.message && <p className="text-danger d-block w-full">{errors.name?.message}</p>}

                  </div>
                </div>

                <div className="row mb-1">
                  <label htmlFor="phone" className="col-sm-3 col-form-label form-label pt-0 pb-0">Phone</label>

                  <div className="col-sm-9">
                    <PhoneInput

                      country={'ge'}
                      inputClass={"form-control form-control-sm " + (errors.phone?.message ? 'border rounded border-danger' : '')}
                      inputStyle={{ width: "100%", border: ".0625rem solid rgba(33, 50, 91, .1)", padding: "6.5px 14px 6.5px 60px" }}
                      value={itemObj?.address.phone}
                      name="phone"
                      id="phoneLabel"
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
                      onChange={(e) => (onTodoChange('address.phone', e), setValue("phone", e))}
                    />
                    {errors.phone?.message && <p className="text-danger d-block w-full">{errors.phone?.message}</p>}
                  </div>
                </div>

                <div className="row mb-1">
                  <label htmlFor="email" className="col-sm-3 col-form-label form-label pt-0 pb-0">Email</label>

                  <div className="col-sm-9">
                    <input type="text"
                      className={"form-control form-control-sm " + (errors.email ? 'border rounded border-danger' : '')}
                      name="email"
                      value={itemObj?.address.email}
                      {...register("email", {
                        required: {
                          value: false
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "invalid email address"
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        }
                      })}
                      onChange={e => {
                        onTodoChange('address.email', e.target.value);
                        setValue("email", e.target.value);
                      }}
                      id="email" placeholder="Receiver email" aria-label="Email"
                    />
                    {errors.email?.message && <p className="text-danger d-block w-full">{errors.email?.message}</p>}

                  </div>
                </div>


                <div className="row mb-1">
                  <label htmlFor="AddressLine1" className="col-sm-3 col-form-label form-label pt-0 pb-0">Address line 1</label>

                  <div className="col-sm-9">
                    <input type="text"
                      className={"form-control form-control-sm " + (errors.address_line_1 ? 'border rounded border-danger' : '')}
                      name="address_line_1"
                      value={itemObj?.address.line_1}
                      {...register("address_line_1", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        },
                        minLength: {
                          value: 5,
                          message: "Too Few Characters. minimum: 5"
                        }
                      })}
                      onChange={e => {
                        onTodoChange('address.line_1', e.target.value);
                        setValue("address_line_1", e.target.value);
                      }}
                      id="AddressLine1" placeholder="Receiver Address Line 1" aria-label="Address Line 1"
                    />
                    {errors.address_line_1?.message && <p className="text-danger d-block w-full">{errors.address_line_1?.message}</p>}

                  </div>
                </div>

                <div className="row mb-1">
                  <label htmlFor="AddressLine2" className="col-sm-3 col-form-label form-label pt-0 pb-0">Address line 2</label>

                  <div className="col-sm-9">
                    <input type="text"
                      value={itemObj?.address.line_2}
                      className={"form-control form-control-sm " + (errors.address_line_2 ? 'border rounded border-danger' : '')}
                      name="address_line_2"
                      {...register("address_line_2", {
                        required: {
                          value: false
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        }
                      })}
                      onChange={e => {
                        onTodoChange('address.line_2', e.target.value);
                        setValue("address_line_2", e.target.value);
                      }}
                      id="AddressLine2" placeholder="Receiver Address Line 2" aria-label="Address Line 2"
                    />
                    {errors.address_line_2?.message && <p className="text-danger d-block w-full">{errors.address_line_2?.message}</p>}

                  </div>
                </div>

                <div className="row mb-1">
                  <label htmlFor="PostalCode" className="col-sm-3 col-form-label form-label pt-0 pb-0">Postal code</label>

                  <div className="col-sm-9">
                    <input type="text"
                      className={"form-control form-control-sm " + (errors.address_postal_code ? 'border rounded border-danger' : '')}
                      name="address_postal_code"
                      value={itemObj?.address.postal_code}
                      {...register("address_postal_code", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 35,
                          message: "Too Many Characters. maximum: 35"
                        },
                        minLength: {
                          value: 3,
                          message: "Too Few Characters. minimum: 3"
                        }
                      })}
                      onChange={e => {
                        onTodoChange('address.postal_code', e.target.value);
                        setValue("address_postal_code", e.target.value);
                      }}
                      id="PostalCode" placeholder="Receiver Postal Code" aria-label="Postal Code"
                    />
                    {errors.address_postal_code?.message && <p className="text-danger d-block w-full">{errors.address_postal_code?.message}</p>}
                  </div>
                </div>
              </form>
            </div>
            {/* <div id="clientReceiverAddresses" className="col-md-6 col-sm-12" style={{ borderLeft: "1px solid #ededed" }}>
              <div className=""
                onScroll={() => onScroll()} ref={listInnerRef}
                style={{ height: "calc(100vh - 220px)", overflowY: "scroll" }}>
                {addressReceivers.length === 0 && (
                  <div className="alert alert-warning mt-2 w-100 d-inline-block mx-auto text-center" role="alert">
                    Receivers history is empty for {filteredCountryList.find((c) => c.value === itemObj.address.country_code).label}
                  </div>
                )}
                {addressReceivers.length > 0 && addressReceivers.map((address, i) => (
                  <ClientAddressCard
                    key={i}
                    address={address}
                    chooseAddressFromHistory={chooseAddressFromHistory}
                    trigger={trigger} />
                ))}
                {addressReceiversLoading && (
                  <div className="d-flex justify-content-center align-items-center m-10">
                    <Spinner animation="border" size="sm" />
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </>
      </Modal.Body>
      <Modal.Footer className="pt-1 pb-2">
        <Button className="btn btn-secondary btn-sm float-end "
          onClick={() => handleSubmit(saveItemAddress)()}
          disabled={itemIsSaving}
        >
          {!itemIsSaving && (
            "Use this address"
          )}
          {itemIsSaving && (
            <i className="fas fa-spinner fa-spin"></i>
          )}
        </Button>
        <button className="btn btn-sm btn-white " onClick={closeEditReceiverAddressModal}>Close</button>

      </Modal.Footer>
    </Modal>

  );
};

export default ReceiverAddressModal;