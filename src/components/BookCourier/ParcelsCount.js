import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import BookStepButtons from "./BookStepButtons";
import { useEffect } from "react";
import { GiTriggerHurt } from "react-icons/gi";

const ParcelsCountList = [
  { value: "1", label: "One 1" },
  { value: "2", label: "Two 2" },
  { value: "3", label: "Three 3" },
  { value: "4", label: "four 4" },
  { value: "5", label: "more" },

];

const ParcelsCount = ({ book, setBook, bookItemObj, proceedNextFieldSet, proceedPrevFieldSet, updateBook, componentName }) => {
  const { register, setValue, getValues, control, handleSubmit, formState: { errors } } = useForm();

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


  return (
    <>
      <div className="col-10">
        <fieldset>
          <div className="card text-center">
            <div className="card-header text-white bg-primary p-3">
              Parcels count
            </div>
            <div className="card-body text-center ps-2 pe-2">
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
            </div>
            {errors.parcels_count?.message && <p className="text-danger d-block w-full">{errors.parcels_count?.message}</p>}
            <div className="card-footer text-muted">
              {/* It is preferable to book the courier the day before visit. */}
            </div>
            {/* <BookStepButtons
              handleSubmit={handleSubmit}
              proceedNextFieldSet={proceedNextFieldSet}
              proceedPrevFieldSet={proceedPrevFieldSet}
              componentName={componentName}
            /> */}
          </div>
        </fieldset>
      </div>
      <div className="col-1 ps-0 ms-n3 ms-lg-0 me-lg-n6" style={{ marginTop: "150px" }}>
        <button className="btn btn-success btn-sm" onClick={handleSubmit(proceedNextFieldSet)}><span className="d-none d-sm-none d-md-block d-lg-block">Next</span> <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
        ></i></button>
      </div>
    </>
  );
};

export default ParcelsCount;