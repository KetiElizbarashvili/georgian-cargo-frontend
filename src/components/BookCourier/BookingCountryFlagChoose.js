import { Link } from "react-router-dom";

const BookingCountryFlagChoose = ({ code, countryListAllIsoData, setShowChooseSourceCountryModal }) => {
  return (
    <Link className={"col-3 ms-2 btn btn-outline-success p-1"}
      to={
        {
          pathname: "/book-a-courier/" + code.toUpperCase(),
          sourcecountry: code.toUpperCase()
        }
      }
      onClick={() => setShowChooseSourceCountryModal(false)}
    >
      <p className="ms-2">
        {countryListAllIsoData.filter(obj => {
          return obj.value === code.toUpperCase()
        })[0].label}
      </p>
      <img
        className="mb-4 btn-outline-dark me-1"
        src={"https://flagcdn.com/w160/" + (code.toLowerCase() == 'uk' ? 'gb' : code.toLowerCase()) + ".png"}
        srcSet={"https://flagcdn.com/w160/" + (code.toLowerCase() == 'uk' ? 'gb' : code.toLowerCase()) + ".png 2x"}
        alt={code.toLowerCase()}
        style={{ width: "100%" }} />

    </Link>
  );
};

export default BookingCountryFlagChoose;