import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import BookStepButtons from "./BookStepButtons";

const ToBeDelivered = ({ book, proceedNextFieldSet, updateBook, proceedPrevFieldSet, componentName }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const [toBeDeliveredPassed, setToBeDeliveredPassed] = useState(false);

  const handleToBeDelivered = () => {
    if (book.to_be_delivered === '') {
      setToBeDeliveredPassed(true);
    }
    else {
      setToBeDeliveredPassed(false);
      handleSubmit(proceedNextFieldSet)();
    }
  };
  return (

    <fieldset>

      <div className="card d-block text-center">
        <div className="card-header bg-primary text-white text-start d-inline-block w-100 p-3">
          <h4 className="text-white d-block w-100">Do you want the package to be delivered to home/address?</h4>
        </div>
        <div className="card-body text-center">
          <button type="button" className={"btn " + (book.to_be_delivered === 1 ? 'btn-secondary' : 'btn-outline-primary')}
            onClick={() => updateBook('to_be_delivered', 1)}
          >Yes</button>
          <button type="button" className={"btn ms-2 " + (book.to_be_delivered === 0 ? 'btn-secondary' : 'btn-outline-primary')}
            onClick={() => updateBook('to_be_delivered', 0)}
          >No</button>
          {toBeDeliveredPassed && <p className="text-danger d-block w-full">This is required</p>}
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

export default ToBeDelivered;