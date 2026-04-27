import { useEffect, useState, useContext } from "react";
import { useRequest } from 'hooks';
import clientAddress from "requests/clientAddress";
import { flagEmoji } from "../../utils/FlagEmoji";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import { Modal } from "react-bootstrap";
import Select from 'react-select';
import getRoutes from "requests/getRoutes";
import countryListAllIsoData from 'utils/CountryList'
import newAddress from 'requests/newAddress';
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "context";
import { toast } from "react-toastify";
import EditAddressModal from "./EditAddressModal";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const ClientAddressTable = () => {
  const [getClientAddress] = useRequest(clientAddress);
  const [addresses, setAddresses] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [getRoutesData] = useRequest(getRoutes);
  const [filteredCountryList, setFilteredCountryList] = useState([]);
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const { auth, setAuth } = useContext(AuthContext);
  const [newAddressReq] = useRequest(newAddress);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [addressIsSaving, setAddressIsSaving] = useState(false);


  const closeEditAddressModal = () => {
    setShowEditAddressModal(false);
  };

  const openEditAddressModal = () => {
    setShowEditAddressModal(true);
  };

  useEffect(() => {
    getAddresses();
  }, []);

  useEffect(() => {
  }, [addresses]);

  const updateAddress = (addr) => {
    handleNewAddress();
  };

  const getAddresses = () => {
    let dat;
    getClientAddress()
      .then((response) => {
        if (response.data.addresses[0] === undefined) {
          dat = { name: auth.staff.name, email: auth.staff.email, phone: auth.staff.phone, address_country_code: 'UK', address_line_1: '', address_line_2: '', address_postal_code: '' };
        }
        else {
          dat = response.data.addresses[0];
          setAddresses({ ...addresses, ['name']: auth.staff.name });
          setAddresses({ ...addresses, ['phone']: auth.staff.phone });

        }
        setAddresses(dat);
        getRoutesData()
          .then((response) => {
            setFilteredCountryList(countryListAllIsoData.filter(obj => {
              return response.data?.routes.map(a => a.code).includes(obj.value)
            }));
            setLoadingAddresses(false);
          });
      }).catch((e) => {
        toast.error("An error occurred");
      });
  };


  const onTodoChange = (index, value) => {
    setAddresses({ ...addresses, [index]: value });
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
          setAuth({ // needs check
            ...auth,
            sourceCountry: addr.AddressCountryCode
          });
          // setAddresses((prev) => [...prev, {name: addr.Name, email: addr.Email, phone: addr.Phone, address_country_code: addr.AddressCountryCode, address_line_1: addr.AddressLine1, address_line_2: addr.AddressLine1,  address_postal_code: addr.AddressPostalCode}])
          toast.success("Address saved!", toastOptions);
          closeEditAddressModal();
        }
        setAddressIsSaving(false);
      }).catch((e) => {
        toast.error("An error occurred");
        setAddressIsSaving(false);
      });
  };


  return (
    <>
      {loadingAddresses && (
        <LoadingSpinner />
      )}
      {!loadingAddresses && addresses.address_line_1 !== '' && (
        <div className="row mb-4">
          <div className="card col-lg-6 col-md-12 col-sm-12">
            <div className="card-body">
              <span class="badge badge bg-primary float-end">Default address</span>

              <h5 className="card-title">{filteredCountryList.find((c) => c.value === addresses.address_country_code).label} &nbsp; {flagEmoji(addresses.address_country_code)} </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Address line 1: &nbsp; <b>{addresses.address_line_1}</b></li>
              <li className="list-group-item">Address line 2: &nbsp; <b>{addresses.address_line_2}</b></li>
              <li className="list-group-item">Postal code: &nbsp;<b>{addresses.address_postal_code}</b></li>
            </ul>
            <div className="card-body">
              <button className="btn btn-link"
                onClick={() => openEditAddressModal()}
              >Edit Address</button>
            </div>
          </div>
        </div>

      )}
      {!loadingAddresses && addresses.address_line_1 === '' && (
        <div className="d-inline-block mx-auto">
          <div className="alert text-danger mb-0">It's required to have address. please create new one.</div>
          <button className="btn btn-secondary  btn-sm"
            onClick={() => openEditAddressModal()}
          >Create new Address</button>
        </div>
      )}

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
        // <Modal
        //       size="lg"
        //       onHide = {closeEditAddressModal}
        //       show={showEditAddressModal}
        //       aria-labelledby="create-route-title"
        //       centered
        //     >
        //       <Modal.Header closeButton>
        //         <Modal.Title id="create-route-title">Address</Modal.Title>
        //       </Modal.Header>

        //       <Modal.Body>
        //       <>
        //       <form>
        //           <div style= {{whiteSpace: "pre"}} id="form-errors" className="alert alert-danger d-none" role="alert">
        //           </div> 
        //           <div className="row mb-4">
        //         <label htmlFor="locationLabel" className="col-sm-3 col-form-label form-label">Location</label>

        //         <div className="col-sm-9">
        //           <div className={"tom-select-custom mb-3"}>
        //           <Controller
        //             control={control}
        //             className={"form-control"}
        //             name="address_country_code"
        //             defaultValue={addresses.address_country_code}
        //             render={({ field: { onChange, value, name, ref } }) => (
        //                     <Select
        //                     // {...register("address_country_code", { required: true, maxLength: 255})}
        //                     inputRef={ref}
        //                     classNamePrefix="addl-class"
        //                     options={filteredCountryList}
        //                     value={filteredCountryList.find((c) => c.value ===  addresses.address_country_code)}
        //                     onChange={(e) => 
        //                       onTodoChange('address_country_code', e.value)
        //                     }
        //                     />
        //                     )}
        //             />
        //         {errors.address_country_code && <p className="text-danger d-block w-full">Please check the Address country code</p>}
        //           </div>
        //         </div>


        //       </div>

        //     <div className="row mb-4">
        //       <label htmlFor="AddressLine1" className="col-sm-3 col-form-label form-label">Address line 1</label>

        //       <div className="col-sm-9">
        //         <input type="text" 
        //         className={"form-control " + (errors.address_line_1 ? 'border rounded border-danger' : '')} 
        //         name="address_line_1" 
        //         value={addresses.address_line_1}
        //         // {...register("address_line_1", { required: true, maxLength: 255 })}
        //         onChange={e => onTodoChange('address_line_1', e.target.value)}
        //         id="AddressLine1" placeholder="Address Line 1" aria-label="Address Line 1"
        //            />
        //        {errors.address_line_1 && <p className="text-danger d-block w-full">Please check Address line 1</p>}

        //       </div>
        //     </div>

        //     <div className="row mb-4">
        //       <label htmlFor="AddressLine2" className="col-sm-3 col-form-label form-label">Address line 2</label>

        //       <div className="col-sm-9">
        //         <input type="text" 
        //         value={addresses.address_line_2}
        //         className={"form-control " + (errors.address_line_2 ? 'border rounded border-danger' : '')} 
        //         name="address_line_2" 
        //         // {...register("address_line_2", { maxLength: 255 })}
        //         onChange={e => onTodoChange('address_line_2', e.target.value)}
        //         id="AddressLine1" placeholder="Address Line 2" aria-label="Address Line 2"
        //            />
        //       {errors.address_line_2 && <p className="text-danger d-block w-full">Please check Address line 2</p>}

        //       </div>
        //     </div>

        //     <div className="row mb-4">
        //       <label htmlFor="PostalCode" className="col-sm-3 col-form-label form-label">Postal code</label>

        //       <div className="col-sm-9">
        //         <input type="text" 
        //         className={"form-control " + (errors.address_postal_code ? 'border rounded border-danger' : '')} 
        //         name="address_postal_code"
        //         value={addresses.address_postal_code} 
        //         // {...register("address_postal_code", { required: true, maxLength: 255 })}
        //         onChange={e => onTodoChange('address_postal_code', e.target.value)}
        //         id="PostalCode" placeholder="Postal Code" aria-label="Postal Code"
        //            />
        //         {errors.address_postal_code && <p className="text-danger d-block w-full">Please check Address postal code</p>}
        //       </div>
        //     </div>

        //           </form>

        //       </>
        //       </Modal.Body>
        //       <Modal.Footer>
        //       <a className="btn btn-secondary "
        //             onClick={() => updateAddress()}
        //             >Save changes</a>
        //       <button className="btn btn-sm btn-white " onClick = {closeEditAddressModal}>Close</button>

        //       </Modal.Footer>
        //     </Modal> 
      )}

    </>
  );
};

export default ClientAddressTable;