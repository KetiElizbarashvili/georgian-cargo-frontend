import { useContext, useState } from "react";
import { AuthContext } from "context";
import PayParcels from "requests/PayParcels";
import useRequest from "../../hooks/useRequest";
import { toast } from "react-toastify";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

export const SummaryForm = ({ parcels, setParcels, staff, setShowSummary }) => {
  const [payPrcls] = useRequest(PayParcels);
  const { auth } = useContext(AuthContext);
  const { accessToken } = { ...auth };
  const [pickingUp, setPickingUp] = useState(false);
  const updatePaymentMethod = (e) => {
    let prcls = [...parcels];

    prcls.map(itm => itm[e.target.name] = e.target.value);
    setParcels(prcls);
  };
  const sumParcels = (parcels) => {
    return parcels.map(d => ({
      parcel: d.tracking_number,
      sum: d.prices.packaging_price + d.prices.freight_price + d.prices.delivery_price +
        d.extra_charges.reduce((n, { amount }) => n + parseFloat(amount), 0)
    })).reduce((n, { sum }) => n + parseFloat(sum), 0)
  };

  const pickUp = () => {
    setPickingUp(true);
    let proms = [];

    parcels.map((prcl, i) => {
      proms[i] = fetch(process.env.REACT_APP_API + "/cargo/pickup", {
        method: 'POST',
        headers: {
          'Authorization': 'Beared ' + accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...prcl,
          source_country_code: prcl.sender.country_code,
          destination_country_code: prcl.receiver.country_code
        })
      })
    });

    Promise.all(proms).then(values => {
      return Promise.all(values.map(res => res.json()));
    }).then(values => {
      let ids = values.map(it => it.cargo.invoice.invoice_id);
      payPrcls({ payment_method: parcels[0].payment_method, invoice_ids: ids })
        .then((response) => {
          if (response?.data?.error === true) {
            toast.error('something went wrong. please check if these parcels already added.', toastOptions);
          } else {
            toast.success('checked out successfully.', toastOptions);
            setParcels([]);
            setShowSummary(false);
          }
        });
    });
  };

  return (
    <>
      {parcels && parcels.map((prcl, i) => (
        <div className="card m-0" key={i}>
          <div className="card-body pt-1 pb-1">
            <div className="row">
              <div className="col-6">
                <span className="d-inline-block w-100">Tracking number: <b>{prcl.tracking_number}</b></span>
                <span className="d-inline-block w-100">Weight: <b>{prcl.weight}</b></span>
                <span className="d-inline-block w-100">Description: <b>{prcl.description}</b></span>
                <span className="d-inline-block w-100">Notes: <b>{prcl.notes}</b></span>
                <span className="d-inline-block w-100">Extra charges:</span>
                <span className="d-inline-block w-100">
                  {prcl.extra_charges && prcl.extra_charges.length > 0 && prcl.extra_charges.map((ec, i) => (
                    <div className="w-auto d-inline-block alert alert-light p-1 ms-1" style={{ fontSize: "15px" }} role="alert">
                      {ec.note}: {ec.amount}
                    </div>
                  ))}
                </span>
              </div>
              <div className="col-6">
                <span className="d-inline-block w-100">From: <b>{prcl.sender.country_code}</b></span>
                <span className="d-inline-block w-100">To: <b>{prcl.receiver.country_code}</b></span>
                <span className="d-inline-block w-100">Freight price: <b>{prcl.prices.freight_price}</b></span>
                <span className="d-inline-block w-100">Delivery price: <b>{prcl.prices.delivery_price}</b></span>
                <span className="d-inline-block w-100">Packaging price: <b>{prcl.prices.packaging_price}</b></span>
                <span className="d-inline-block w-100">Extra total price: <b>{prcl.extra_charges.reduce((n, { amount }) => n + parseFloat(amount), 0)}</b></span>
                <span className="d-inline-block w-100">Total price: <b>{
                  prcl.prices.packaging_price +
                  prcl.prices.freight_price +
                  prcl.prices.delivery_price +
                  prcl.extra_charges.reduce((n, { amount }) => n + parseFloat(amount), 0)
                }</b></span>

              </div>
            </div>
          </div>
          <hr />
        </div>
      ))}
      <div className="row">
        <div className="col-12 text-end pe-4">
          Sum: <b>{Number.parseFloat(sumParcels(parcels)).toFixed(2)}</b>
        </div>
      </div>
      <div className="col-12">
        <div className="form-floating m-2 border">
          <select
            value={parcels[0]?.payment_method}
            onChange={(e) => updatePaymentMethod(e)}
            type="text" name="payment_method" className="form-control" id="floatingInput" placeholder="">
            <option value={'ONLINE'}>{'Online'}</option>
            {staff.privileges.includes("COLLECT_CASH_PAYMENTS") && (
              <option value={'CASH'}>{'Cash'}</option>
            )}
            {staff.privileges.includes("COLLECT_BANK_PAYMENTS") && (
              <option value={'BANK'}>{'Bank'}</option>
            )}
            <option value={'NO_PAYMENT'}>{'No Payment'}</option>

          </select>
          <label for="floatingInput">Payment method</label>
        </div>
      </div>
      <div className="row">
        <div className="col-12 ms-2 me-2 text-center">
          <button
            disabled={false}
            onClick={() => pickUp()}
            type="button" className="btn btn-warning btn-lg mt-3 w-85 d-inline-block">Checkout
          </button>
        </div>
      </div>
    </>
  );
};