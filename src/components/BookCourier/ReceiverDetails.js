import { useForm, Controller } from "react-hook-form";
import BookStepButtons from "./BookStepButtons";

const ReceiverDetails = ({ book, proceedNextFieldSet, proceedPrevFieldSet, updateBook, componentName }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm();

  return (

    <fieldset>
      <div className="card d-block text-center">
        <div className="card-header bg-primary text-white text-start d-inline-block w-100 p-3">
          <h4 className="text-white d-block w-100">Write the details of the recipient of the parcel</h4>
          <span className="text-white float-start">
            Name, surname, phone number and address.
          </span>
        </div>
        <div className="card-body text-center">
          <div className="form-group">
            {/* <label for="receiver_details">Parcel(s) Weight</label> */}
            <textarea className="form-control" id="receiver_details"
              rows={5}
              placeholder="Write as many recipients as many parcels you have"
              value={book.receiver_details}
              {...register("receiver_details", {
                required: {
                  value: true,
                  message: "This field is required"
                },
                maxLength: {
                  value: 10000,
                  message: "Too Many Characters. maximum: 10000"
                }
              })}
              onChange={({ target: { value } }) => { updateBook('receiver_details', value) }}
            />
            {errors.receiver_details?.message && <p className="text-danger d-block w-full">{errors.receiver_details?.message}</p>}
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
  );
};

export default ReceiverDetails;