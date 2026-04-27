import countryListAllIsoData from 'utils/CountryList'
import { flagEmoji } from "../../utils/FlagEmoji";

const ClientAddressCard = ({ address, chooseAddressFromHistory, trigger }) => {

  return (
    <div className="row mb-4 ms-0 me-0 text-start">
      <div className="card col-md-10 mx-auto">
        <div className="card-body">
          <span class="badge badge bg-primary float-end">Address: {address.id}</span>

          <h5 className="card-title">{countryListAllIsoData.find((c) => c.value === address.address_country_code).label} &nbsp; {flagEmoji(address.address_country_code)} </h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item p-1">Name: &nbsp; <b>{address.name}</b></li>
          <li className="list-group-item p-1">Phone: &nbsp; <b>{address.phone}</b></li>
          <li className="list-group-item p-1">Email: &nbsp; <b>{address.email}</b></li>
          <li className="list-group-item p-1">Address line 1: &nbsp; <b>{address.address_line_1}</b></li>
          <li className="list-group-item p-1">Address line 2: &nbsp; <b>{address.address_line_2}</b></li>
          <li className="list-group-item p-1">Postal code: &nbsp;<b>{address.address_postal_code}</b></li>
        </ul>
        <div className="card-body">
          <button className="btn btn-secondary btn-sm p-2 float-end"
            onClick={() => chooseAddressFromHistory(address)}
          >Use this address</button>
        </div>
      </div>
    </div >
  );
};

export default ClientAddressCard;