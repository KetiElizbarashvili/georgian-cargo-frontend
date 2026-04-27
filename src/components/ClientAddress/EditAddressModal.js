import { Modal, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';

const EditAddressModal = ({ addresses, showEditAddressModal, closeEditAddressModal, filteredCountryList, onTodoChange, updateAddress, openEditAddressModal, addressIsSaving }) => {

  const { register, control, handleSubmit, formState: { errors } } = useForm();

  return (
    <Modal
      size="lg"
      onHide={closeEditAddressModal}
      show={showEditAddressModal}
      aria-labelledby="create-route-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="create-route-title">Address</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <form>
            <div style={{ whiteSpace: "pre" }} id="form-errors" className="alert alert-danger d-none" role="alert">
            </div>
            <div className="row mb-2">
              <label htmlFor="locationLabel" className="col-sm-3 col-form-label form-label">Location</label>

              <div className="col-sm-9">
                <div className={"tom-select-custom mb-3"}>
                  <Controller
                    control={control}
                    className={"form-control"}
                    name="address_country_code"
                    defaultValue={addresses.address_country_code}
                    render={({ field: { onChange, value, name, ref } }) => (
                      <Select
                        // {...register("address_country_code", { required: true, maxLength: 255})}
                        inputRef={ref}
                        classNamePrefix="addl-class"
                        options={filteredCountryList}
                        value={filteredCountryList.find((c) => c.value === addresses.address_country_code)}
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
              <label htmlFor="AddressLine1" className="col-sm-3 col-form-label form-label">Address line 1</label>

              <div className="col-sm-9">
                <input type="text"
                  className={"form-control " + (errors.address_line_1 ? 'border rounded border-danger' : '')}
                  name="address_line_1"
                  value={addresses.address_line_1}
                  // {...register("address_line_1", { required: true, maxLength: 255 })}
                  onChange={e => onTodoChange('address_line_1', e.target.value)}
                  id="AddressLine1" placeholder="Address Line 1" aria-label="Address Line 1"
                />
                {errors.address_line_1 && <p className="text-danger d-block w-full">Please check Address line 1</p>}

              </div>
            </div>

            <div className="row mb-2">
              <label htmlFor="AddressLine2" className="col-sm-3 col-form-label form-label">Address line 2</label>

              <div className="col-sm-9">
                <input type="text"
                  value={addresses.address_line_2}
                  className={"form-control " + (errors.address_line_2 ? 'border rounded border-danger' : '')}
                  name="address_line_2"
                  // {...register("address_line_2", { maxLength: 255 })}
                  onChange={e => onTodoChange('address_line_2', e.target.value)}
                  id="AddressLine1" placeholder="Address Line 2" aria-label="Address Line 2"
                />
                {errors.address_line_2 && <p className="text-danger d-block w-full">Please check Address line 2</p>}

              </div>
            </div>

            <div className="row mb-2">
              <label htmlFor="PostalCode" className="col-sm-3 col-form-label form-label">Postal code</label>

              <div className="col-sm-9">
                <input type="text"
                  className={"form-control " + (errors.address_postal_code ? 'border rounded border-danger' : '')}
                  name="address_postal_code"
                  value={addresses.address_postal_code}
                  // {...register("address_postal_code", { required: true, maxLength: 255 })}
                  onChange={e => onTodoChange('address_postal_code', e.target.value)}
                  id="PostalCode" placeholder="Postal Code" aria-label="Postal Code"
                />
                {errors.address_postal_code && <p className="text-danger d-block w-full">Please check Address postal code</p>}
              </div>
            </div>

          </form>

        </>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary "
          onClick={() => updateAddress()}
          disabled={addressIsSaving}
        >
          {!addressIsSaving && (
            "Save changes"
          )}
          {addressIsSaving && (
            <i className="fas fa-spinner fa-spin"></i>
          )}
        </Button>
        <button className="btn btn-sm btn-white " onClick={closeEditAddressModal}>Close</button>

      </Modal.Footer>
    </Modal>

  );
};

export default EditAddressModal;