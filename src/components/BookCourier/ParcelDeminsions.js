import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import BookStepButtons from "./BookStepButtons";

const ParcelDeminsions = ({ book, proceedNextFieldSet, proceedPrevFieldSet, updateBook, componentName }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm();

  return (
    <>
      <div className="col-10">

        <fieldset>
          <div className="card d-block text-center">
            <div className="card-header bg-primary text-white text-start d-inline-block w-100 p-3">
              <h4 className="text-white d-block w-100">Write the exact or approximate weight of the parcel</h4>
              <span className="text-white float-start">
                as much weight as parcels, each weight independently
              </span>
            </div>
            <div className="card-body text-center">
              <div className="form-group">
                <label for="parcels_weight">Parcel(s) Weight</label>
                <input type="text" className="form-control" id="parcels_weight" placeholder="ex. 15kg"
                  value={book.parcels_weight}
                  {...register("parcels_weight", {
                    required: {
                      value: true,
                      message: "This field is required"
                    },
                    maxLength: {
                      value: 255,
                      message: "Too Many Characters. maximum: 255"
                    }
                  })}
                  onChange={({ target: { value } }) => { updateBook('parcels_weight', value) }}

                />
                {errors.parcels_weight?.message && <p className="text-danger d-block w-full">{errors.parcels_weight?.message}</p>}
              </div>
              <div className="form-group">
                <label for="parcels_deminsions">Parcel(s) Deminsions</label>
                <input type="text" className="form-control" id="parcels_deminsions" placeholder="ex. 1ftx2ft"
                  value={book.parcels_deminsions}
                  {...register("parcels_deminsions", {
                    required: {
                      value: true,
                      message: "This field is required"
                    },
                    maxLength: {
                      value: 255,
                      message: "Too Many Characters. maximum: 255"
                    }
                  })}
                  onChange={({ target: { value } }) => { updateBook('parcels_deminsions', value) }}
                />
                {errors.parcels_deminsions?.message && <p className="text-danger d-block w-full">{errors.parcels_deminsions?.message}</p>}
              </div>
              <div className="form-group">
                <label for="parcels_content">Parcel(s) Content and Parcel(s) Value</label>
                <input type="text" className="form-control" id="parcels_content" placeholder="ex. clothes, 300GBP"
                  value={book.parcels_content}
                  {...register("parcels_content", {
                    required: {
                      value: true,
                      message: "This field is required"
                    },
                    maxLength: {
                      value: 255,
                      message: "Too Many Characters. maximum: 255"
                    }
                  })}
                  onChange={({ target: { value } }) => { updateBook('parcels_content', value) }}
                />
                {errors.parcels_content?.message && <p className="text-danger d-block w-full">{errors.parcels_content?.message}</p>}
              </div>
            </div>
            <BookStepButtons
              handleSubmit={handleSubmit}
              proceedNextFieldSet={proceedNextFieldSet}
              proceedPrevFieldSet={proceedPrevFieldSet}
              componentName={componentName}
            />
          </div>
        </fieldset>
      </div>
      <div className="col-1 align-self-center ps-0">
        <button className="btn btn-success btn-sm" onClick={handleSubmit(proceedNextFieldSet)}><span className="d-none d-sm-none d-md-block d-lg-block">Next</span> <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
        ></i></button>
      </div>
    </>
  );
};

export default ParcelDeminsions;