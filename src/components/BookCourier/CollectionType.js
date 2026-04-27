import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import BookStepButtons from "./BookStepButtons";
import { useState } from 'react';

const CollectionType = ({ book, setBook, proceedNextFieldSet, proceedPrevFieldSet, componentName }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
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
              <h4 className="text-white d-block w-100">Service Type</h4>
              <p className="text-white float-start">
                <b>Home collection</b> when courier visits to your address
                or <b>Drop Off</b> when you will deliver your parcels to our office.
              </p>
            </div>
            <div className="card-body text-center">
              <div className="row">
                <div className="col-sm-6 mx-auto">

                  <label
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
                  </label>


                </div>
              </div>
              {!atLeastOneSelected && <p className="text-danger d-block w-full">You need to check on option.</p>}
            </div>
            {/* <BookStepButtons
              handleSubmit={handleSubmit}
              proceedNextFieldSet={(book.home_collection || book.drop_off) ? proceedNextFieldSet : () => setAtLeastOneSelected(false)}
              proceedPrevFieldSet={proceedPrevFieldSet}
              componentName={componentName}
            /> */}
          </div>
        </fieldset>
      </div>
      <div className="col-1 align-self-center ps-0">
        <button className="btn btn-success btn-sm" onClick={handleSubmit(proceedNextFieldSet)}><span className="d-none d-sm-none d-md-block d-lg-block">Next</span> <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
        ></i></button>
      </div>
    </>

  );
}

export default CollectionType;
