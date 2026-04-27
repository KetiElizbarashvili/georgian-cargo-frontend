import React, { useState, useEffect, useContext, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";

const ItemDetailsModal = ({ saveItemDetails, onTodoChange, activeItemId, book, itemObj, setItemObj, closeItemDetailsModal, showItemDetailsModal }) => {
  const { register, setValue, trigger, control, handleSubmit, formState: { errors } } = useForm();

  const itemIsSaving = false;

  useEffect(() => {
    if (showItemDetailsModal) {
      setValue("weight", '');
      setValue("value", '');
      setValue("dimensions", '');
    }
  }, [showItemDetailsModal]);

  return (
    <Modal
      size="md"
      onHide={closeItemDetailsModal}
      show={showItemDetailsModal}
      aria-labelledby="enter-receiver-address"
      centered
    >
      <Modal.Header closeButton
        className="">
        <Modal.Title id="create-route-title" className="">Enter item details for item: {activeItemId}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <form>
                <div style={{ whiteSpace: "pre" }} id="form-errors" className="alert alert-danger d-none" role="alert">
                </div>

                <div className="row mb-1">
                  <label htmlFor="weight" className="col-sm-3 col-form-label form-label">Weight</label>

                  <div className="col-sm-9">
                    <div class="input-group input-group-sm mb-3">

                      <input type="text"
                        className={"form-control form-control-sm " + (errors.weight ? 'border rounded border-danger' : '')}
                        name="weight"
                        value={itemObj?.item.weight}
                        {...register("weight", {
                          required: {
                            value: true,
                            message: "This field is required"
                          },
                          valueAsNumber: true,
                          validate: (value) => value > 0 || "Value must be number",
                        })}
                        onChange={e => onTodoChange('item.weight', e.target.value)}
                        id="weight" placeholder="Ex: 4.5" aria-label="weight"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text btn-secondary text-dark" id="basic-addon1">kg</span>
                      </div>
                    </div>

                    {errors.weight?.message && <p className="text-danger d-block w-full">{errors.weight?.message}</p>}

                  </div>
                </div>

                <div className="row mb-1">
                  <label htmlFor="dimensions" className="col-sm-3 col-form-label form-label">Dimensions</label>

                  <div className="col-sm-9">
                    <input type="text"
                      className={"form-control form-control-sm " + (errors.dimensions ? 'border rounded border-danger' : '')}
                      name="dimensions"
                      value={itemObj?.item.dimensions}
                      {...register("dimensions", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        }
                      })}
                      onChange={e => onTodoChange('item.dimensions', e.target.value)}
                      id="dimensions" placeholder="Ex: 20cm/20cm/50cm" aria-label="dimensions"
                    />
                    <small className="text-muted">width/length/height</small>
                    {errors.dimensions?.message && <p className="text-danger d-block w-full">{errors.dimensions?.message}</p>}

                  </div>
                </div>

                <div className="row mb-1">
                  <label htmlFor="value" className="col-sm-3 col-form-label form-label">Value</label>

                  <div className="col-sm-9">
                    <input type="text"
                      className={"form-control form-control-sm " + (errors.value ? 'border rounded border-danger' : '')}
                      name="value"
                      value={itemObj?.item.value}
                      {...register("value", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        }
                      })}
                      onChange={e => onTodoChange('item.value', e.target.value)}
                      id="value" placeholder="Ex: 100 eur / or 60 gbp" aria-label="value"
                    />
                    <small className="text-muted">item price on market</small>
                    {errors.value?.message && <p className="text-danger d-block w-full">{errors.value?.message}</p>}

                  </div>
                </div>

                <div className="row mb-1">
                  <label htmlFor="details" className="col-sm-3 col-form-label form-label">Content</label>

                  <div className="col-sm-9">
                    <textarea
                      row={5}
                      className={"form-control form-control-sm " + (errors.details ? 'border rounded border-danger' : '')}
                      name="details"
                      value={itemObj?.item.details}
                      {...register("details", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        maxLength: {
                          value: 255,
                          message: "Too Many Characters. maximum: 255"
                        }
                      })}
                      onChange={e => onTodoChange('item.details', e.target.value)}
                      id="details" placeholder="whats inside parcel?" aria-label="details"
                    />

                    {errors.details?.message && <p className="text-danger d-block w-full">{errors.details?.message}</p>}

                  </div>
                </div>

              </form>
            </div>
          </div>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-secondary btn-sm float-end "
          onClick={() => handleSubmit(saveItemDetails)()}
          disabled={itemIsSaving}
        >
          {!false && (
            "Save"
          )}
          {false && (
            <i className="fas fa-spinner fa-spin"></i>
          )}
        </Button>
        <button className="btn btn-sm btn-white " onClick={() => closeItemDetailsModal()}>Close</button>

      </Modal.Footer>
    </Modal>

  );
};

export default ItemDetailsModal;