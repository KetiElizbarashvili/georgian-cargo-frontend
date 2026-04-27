import Spinner from "react-bootstrap/Spinner";

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center m-10">
      <Spinner animation="border" size="sm" />
    </div>
  );
};

export default LoadingSpinner;