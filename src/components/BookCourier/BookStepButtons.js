const BookStepButtons = ({ handleSubmit, proceedNextFieldSet, proceedPrevFieldSet, componentName }) => {
  return (
    <>
      {componentName !== 'SourceFieldSet' && (
        <div className="span2 pb-4 text-end me-4 ms-4">
          <button className="float-start btn btn-secondary btn-sm" onClick={proceedPrevFieldSet}><i className="bi bi-arrow-left-short" style={{ fontSize: "18px" }}
          ></i> Back</button>
          <button className="btn btn-success btn-sm" onClick={handleSubmit(proceedNextFieldSet)}>Next <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
          ></i></button>
        </div>
      )
      }
    </>



  );
};

export default BookStepButtons;