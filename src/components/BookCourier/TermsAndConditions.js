import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
import BookStepButtons from "./BookStepButtons";

const TermsAndConditions = ({ book, proceedNextFieldSet, proceedPrevFieldSet, bookingNextStepping, componentName }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <>
      {/* {componentName !== 'SourceFieldSet' && (
        <div className="col-1 align-self-center">
          <button className="float-start btn btn-secondary btn-sm" onClick={proceedPrevFieldSet}><i className="bi bi-arrow-left-short" style={{ fontSize: "18px" }}
          ></i> Back</button>
        </div>
      )} */}
      <div className="col-10">
        <fieldset>
          <div className="card text-center">
            <div className="card-header text-white bg-primary p-3">
              Terms and Conditions
            </div>
            <div className="card-body text-center">
              <div className="form-check w-25 mx-auto">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" name="terms_and_conditions"
                  {...register("terms_and_conditions", { required: true })} />
                <label className="form-check-label" for="flexCheckChecked">
                  I agree to <a target="_blank" href="https://drive.google.com/file/d/11QGFmVGK__noTfeE9N61cSATQIydt7hR/view">terms & conditions.</a>
                </label>
              </div>

              {/* <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" name="terms_and_conditions" id="exampleCheck1"
              {...register("terms_and_conditions", { required: true })}
            />
            <label className="form-check-label" name="terms_and_conditions" htmlFor="exampleCheck1">I agree to <a target="_blank" href="https://drive.google.com/file/d/11QGFmVGK__noTfeE9N61cSATQIydt7hR/view">terms & conditions.</a></label>
          </div> */}
              {errors.terms_and_conditions && <p className="text-danger d-block w-full">You need to agree terms & conditions to finish this form.</p>}
            </div>
            <div className="span2 pb-4">
              {/* <button className="float-start btn btn-secondary btn-sm" onClick={() => proceedPrevFieldSet()}><i className="bi bi-arrow-left-short" style={{ fontSize: "18px" }}
              ></i> Back</button> */}
              <Link to="/dashboard/bookings" className="btn btn-danger  me-2 p-2">Cancel</Link>
              <Button className="btn btn-success  btn-sm"
                onClick={handleSubmit(proceedNextFieldSet)}
                disabled={bookingNextStepping}
              >
                {!bookingNextStepping && (
                  "Submit"
                )}
                {bookingNextStepping && (
                  <i className="fas fa-spinner fa-spin"></i>
                )}
              </Button>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default TermsAndConditions;