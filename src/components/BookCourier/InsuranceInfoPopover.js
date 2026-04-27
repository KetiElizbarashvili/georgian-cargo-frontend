import React from "react";
import Popover from 'react-bootstrap/Popover';

const InsuranceInfoPopover = React.forwardRef((props, ref) => {
  return (
    <Popover  {...props} ref={ref} className="border border-secondary" id="popover-trigger-hover-focus" title="Popover bottom">
      {
      }
      {props.route.toLowerCase() === 'uk' && (
        <div className="p-2 d-inline-block">Insurance details info UK!</div>
      )}
      {props.route.toLowerCase() === 'ie' && (
        <div className="p-2 d-inline-block">Insurance details info IE!</div>
      )}
      {props.route.toLowerCase() === 'se' && (
        <div className="p-2 d-inline-block">Insurance details info SE!</div>
      )}
      {props.route.toLowerCase() === 'ge' && (
        <div className="p-2 d-inline-block">Insurance details info GE!</div>
      )}
    </Popover >
  );
});

export default InsuranceInfoPopover;