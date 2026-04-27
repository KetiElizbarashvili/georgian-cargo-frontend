import React from "react";
import Popover from 'react-bootstrap/Popover';
import countryListAllIsoData from 'utils/CountryList'
import { flagEmoji } from "../../utils/FlagEmoji";

const BookAddressPopover = React.forwardRef((props, ref) => {
  return (
    <Popover  {...props} ref={ref} className="border border-secondary" id="popover-trigger-hover-focus" title="Popover bottom">
      {
        props.address === undefined && (
          <div className="p-2 d-inline-block">Reveiver address is empty!</div>
        )
      }
      {
        props.address !== undefined && (
          <div className="row ms-0 me-0 text-start">
            <div className="block col-md-10 mx-auto p-0 m-0">
              <div className="card-body">
                <span class="badge badge bg-primary float-end">Address: {props.address?.id}</span>

                <h5 className="card-title">{countryListAllIsoData.find((c) => c.value === props.address?.country_code).label} &nbsp; {flagEmoji(props.address?.country_code)} </h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item p-1">Name: &nbsp; <b>{props.address?.name}</b></li>
                <li className="list-group-item p-1">Phone: &nbsp; <b>{props.address?.phone}</b></li>
                <li className="list-group-item p-1">Email: &nbsp; <b>{props.address?.email}</b></li>
                <li className="list-group-item p-1">Address line 1: &nbsp; <b>{props.address?.line_1}</b></li>
                <li className="list-group-item p-1">Address line 2: &nbsp; <b>{props.address?.line_2}</b></li>
                <li className="list-group-item p-1">Postal code: &nbsp;<b>{props.address?.postal_code}</b></li>
              </ul>
            </div>
          </div >
        )
      }
    </Popover >
  );
  // <Popover  {...props} ref={ref} id="popover-trigger-hover-focus" title="Popover bottom">

  {/* </Popover> */ }

  // );
});

export default BookAddressPopover;