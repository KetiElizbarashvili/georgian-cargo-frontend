import React from "react";
import Popover from 'react-bootstrap/Popover';
import { flagEmoji } from "../../utils/FlagEmoji";

const BookItemDetailsPopover = React.forwardRef((props, ref) => {
  return (
    <Popover  {...props} ref={ref} className="border border-secondary" id="popover-trigger-hover-focus" title="Popover bottom">
      {
        props.item === undefined && (
          <div className="p-2 d-inline-block">Item Details is empty!</div>
        )
      }
      {
        props.item !== undefined && (
          <div className="row ms-0 me-0 text-start">
            <div className="block col-md-10 mx-auto m-0 p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item p-1">Item Weight: &nbsp; <b>{props.item?.weight}</b></li>
                <li className="list-group-item p-1">Item Dimensions: &nbsp; <b>{props.item?.dimensions}</b></li>
                <li className="list-group-item p-1">Item Value: &nbsp; <b>{props.item?.value}</b></li>
                <li className="list-group-item p-1">Item Content: &nbsp; <b>{props.item?.details}</b></li>
              </ul>
            </div>
          </div >
        )
      }
    </Popover >
  );
});

export default BookItemDetailsPopover;