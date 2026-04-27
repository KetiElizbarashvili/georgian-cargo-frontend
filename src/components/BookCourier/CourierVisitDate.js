import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import BookStepButtons from "./BookStepButtons";
import { useEffect, useState } from "react";


const ParcelsCountList = [
  { value: "1", label: "One 1" },
  { value: "2", label: "Two 2" },
  { value: "3", label: "Three 3" },
  { value: "4", label: "four 4" },
  { value: "5", label: "more" },

];

const CourierVisitDate = ({ book, setBook, bookItemObj, proceedNextFieldSet, proceedPrevFieldSet, updateBook, componentName }) => {
  const { register, setValue, getValues, control, handleSubmit, formState: { errors } } = useForm();
  const [showModal, setShowModal] = useState(true);
  const validDate = (someDate) => {
    return new Date(someDate).setHours(24, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
  }

  useEffect(() => {
    setValue("parcels_count", book.items.length);
  }, [book.items]);

  const updateBookItemsCount = (val) => {
    if (val === '-') {
      setBook({ ...book, items: book.items.slice(0, -1) });
    }
    else if (val.toString() === '+') {
      const obj = JSON.parse(JSON.stringify(bookItemObj));
      obj.item.id = book.items.length + 1;
      setBook({ ...book, items: [...book.items, obj] });
    }

    // (parseInt(book.parcels_count) - 1 < 2 ? 1 : parseInt(book.parcels_count) - 1)
    // const obj = JSON.parse(JSON.stringify(bookItemObj));
    // obj.item.id = book.items.length + 1;
    // setBook({ ...book, items: [...book.items, obj] });
  };

  const [atLeastOneSelected, setAtLeastOneSelected] = useState(true);
  const handleCheckClickDropOff = (e) => {
    setBook({ ...book, drop_off: 1, home_collection: 0 });
  }

  const handleCheckClickHomeCollection = (e) => {
    setBook({ ...book, home_collection: 1, drop_off: 0 });
  }

  return (
    <>
      <div className="col-10">
        <fieldset>
          <div className="card text-center">
            <div className="card-header text-white bg-primary text-start d-inline-block w-100 p-3">
              <a data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                <div className="row">
                  <div className="col-10">
                    <h4 className="text-white d-block w-100">Courier visit date, Parcels count and Service.</h4>
                  </div>
                  <div className="col-1">
                    <i className="bi bi-chevron-double-down float-end text-dark"></i>
                  </div>
                </div>

              </a>
              <div class="collapse" id="collapseExample">

                <small className="text-white float-start">
                  It is preferable to book the courier the day before visit.
                </small>
                <small className="text-white float-start">
                  <b>Home collection</b> when courier visits to your address
                  or <b>Drop Off</b> when you will deliver your parcels to our office.
                </small>
              </div>
            </div>
            <div className="card-body text-center ps-2 pe-2 pt-2">
              <div className="row">
                <div className="col-12 col-lg-4">
                  <p className="card-text">Pick courier visit date</p>
                  <input
                    style={{ width: "200px" }}
                    type={"date"} id="visit_date"
                    className={"form-control d-inline-block"}
                    value={book.visit_date}
                    {...register("visit_date", {
                      required: {
                        value: true,
                        message: "This field is required"
                      },
                      maxLength: {
                        value: 255,
                        message: "Too Many Characters. maximum: 255"
                      },
                      validate: value => validDate(value) || 'This date is in past.',
                    })}
                    onChange={({ target: { value } }) => { updateBook('visit_date', value) }} />
                  {errors.visit_date?.message && <p className="text-danger d-block w-full">{errors.visit_date?.message}</p>}
                  <hr />
                </div>
                <div className="col-12 col-lg-4">
                  <p className="card-text">How many parcels you got?</p>

                  <div className="input-group mb-3 mx-auto"
                    style={{ width: "250px" }}
                  >
                    <div className="input-group-prepend">
                      <button className="btn btn-secondary" type="button"
                        onClick={() => updateBookItemsCount('-')}
                      >-</button>
                    </div>
                    <input
                      type="text"
                      className={"form-control " + (errors.parcels_count ? 'border rounded border-danger' : '')}
                      name="parcels_count"
                      value={book.items.length}
                      // defaultValue={book.items.length}
                      disabled={true}
                      {...register("parcels_count", {
                        required: {
                          value: true,
                          message: "This field is required"
                        },
                        valueAsNumber: {
                          value: true,
                          message: "Value must be number",
                        },
                        validate: value => value > 0 || "Count must be at least 1"
                      })}
                      onChange={e => setValue("parcels_count", book.items.length)}
                      id="parcels_count" placeholder="Ex: 5" aria-label="Parcels Count"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-secondary" type="button"
                        onClick={() => updateBookItemsCount('+')}
                      >+</button>
                    </div>
                  </div>
                  {errors.parcels_count?.message && <p className="text-danger d-block w-full">{errors.parcels_count?.message}</p>}
                  <hr />
                </div>
                <div className="col-12 col-lg-4">
                  <div className="row">
                    <div className="col-sm-6 mx-auto">

                      <div class="form-check">
                        <input
                          onClick={(e) => handleCheckClickDropOff(e)}
                          class="form-check-input" type="radio"
                          name="home_collection"
                          id="flexRadioDefault1" checked={book.drop_off} />
                        <label class="form-check-label" for="flexRadioDefault1">
                          Drop Off
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          onClick={(e) => handleCheckClickHomeCollection(e)}
                          class="form-check-input" type="radio"
                          name="home_collection"
                          id="flexRadioDefault2"
                          checked={book.home_collection} />
                        <label class="form-check-label" for="flexRadioDefault2">
                          Home Collection
                        </label>
                      </div>

                      {/* <label
                        className={"btn ms-2 " + (book.home_collection === 1 ? "btn-secondary" : "btn-outline-primary")}>
                        <input type="checkbox"
                          name="home_collection"
                          checked={book.home_collection}
                          onChange={(e) => handleCheckClickHomeCollection(e)}
                        /> Home Collection
                      </label>

                      <label className={"btn ms-2 " + (book.drop_off === 1 ? "btn-secondary" : "btn-outline-primary")}
                      >
                        <input type="checkbox"
                          name="home_collection"
                          checked={book.drop_off}
                          onChange={(e) => handleCheckClickDropOff(e)}
                        /> Drop Off
                      </label> */}


                    </div>
                  </div>
                  {!atLeastOneSelected && <p className="text-danger d-block w-full">You need to check on option.</p>}
                </div>
              </div>



            </div>
            {/* <BookStepButtons
              handleSubmit={handleSubmit}
              proceedNextFieldSet={proceedNextFieldSet}
              proceedPrevFieldSet={proceedPrevFieldSet}
              componentName={componentName}
            /> */}
          </div>
          <div className={"modal fade " + (showModal ? 'show d-block' : 'd-none')} id="visitdatemodal" tabindex="-1" aria-labelledby="visitdatemodalLabel" aria-hidden="true">
            <div className="modal-dialog shadow-lg ">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="visitdatemodalLabel">Information</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  Be aware. agent will contact you and inform about visiting date.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Okey</button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="col-1 ps-0 ms-n3 ms-lg-0 me-lg-n6" style={{ marginTop: "150px" }}>
        <button className="btn btn-success btn-sm" onClick={handleSubmit((book.home_collection || book.drop_off) ? proceedNextFieldSet : () => setAtLeastOneSelected(false))}><span className="d-none d-sm-none d-md-block d-lg-block">Next</span> <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
        ></i></button>
      </div>
    </>
  );
};

export default CourierVisitDate;