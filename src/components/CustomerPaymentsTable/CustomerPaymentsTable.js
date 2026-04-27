import React, { useState, useEffect, useContext } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useRequest } from "hooks";
import { currency_symbols } from "../../utils/Currency";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import moment from "moment";
import $ from "jquery";
import { Modal, SpinnerButton, ValidatedInput } from "utils";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import paymentsRequest from "requests/clientPayments";
import ClientFooter from 'components/Footer/ClientFooter';

const CustomerPaymentsTable = () => {
  const [loading, setLoading] = useState(true);
  const [getPayments] = useRequest(paymentsRequest);
  const [cutomerPayments, setCutomerPayments] = useState(null);
  const [page, setPage] = useState(0);


  useEffect(() => {
    getPaymentsHandler();
    setLoading(false);
  }, []);

  const paginateNext = () => {
    setPage(page + 10);
  };

  const paginatePrev = () => {
    let prev = page < 10 ? 0 : page - 10;
    setPage(prev);
  };

  const getPaymentsHandler = () => {
    getPayments({ start: page })
      .then((response) => {
        setCutomerPayments(response.data.payments);
        setLoading(false);
      });
  };

  useEffect(() => {
    getPaymentsHandler();
  }, [page]);

  return (
    <>

      {loading && (
        <div className="d-flex justify-content-center align-items-center m-10">
          <Spinner animation="border" size="sm" />
        </div>
      )}

      <div className="table-responsive bg-white rounded">
        <table className="table table-borderless table-thead-bordered table-nowrap table-align-middle">
          <thead className="thead-light">
            <tr>
              <th>Reference</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              {/* <th></th> */}
            </tr>
          </thead>



          {!loading && cutomerPayments && cutomerPayments.map((payment, i) => (
            <tr className="mt-4">
              <td><span>{payment.tracking_number}</span></td>
              <td>
                {payment.payment_status === 'PAID' && (
                  <span className="badge bg-success text-success text-white p-2">Successful</span>
                )}
                {payment.payment_status === 'PENDING' && (
                  <span class="badge bg-warning text-warning text-white p-2">Pending</span>
                )}
              </td>
              <td>{currency_symbols(payment.currency)}{payment.amount.toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
              <td>{payment.method}</td>
              <td>
                {moment(payment.created_at).format(
                  "D MMMM, YYYY"
                )}
              </td>
              {/* <td><a className="btn btn-white btn-xs" href="@@autopath/page-invoice.html"><i className="bi-file-earmark-arrow-down-fill me-1"></i> PDF</a></td> */}
              {/* <td><a className="btn btn-white btn-xs" href="javascript:;" data-bs-toggle="modal" data-bs-target="#accountInvoiceReceiptModal"><i className="bi-eye-fill me-1"></i> Quick view</a></td> */}
            </tr>
          ))}
          <tbody>


          </tbody>
        </table>
        {!loading && cutomerPayments && cutomerPayments.length == 0 && (
          <div className="alert alert-warning mt-2 w-100 d-inline-block mx-auto text-center" role="alert">
            payments not found
          </div>
        )}

        <div className="text-center">
          <nav aria-label="Page navigation" className="d-inline-block">
            <ul className="pagination">
              <li className={"page-item" + (page == 0 ? " disabled" : "")}>
                <a className="page-link" onClick={paginatePrev} aria-label="Previous">Prev</a>
              </li>
              {/* <li className="page-item active"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li>
          <li className="page-item disabled"><a className="page-link" href="#">...</a></li>
          <li className="page-item"><a className="page-link" href="#">5</a></li> */}
              <li className={"page-item"}>
                <a className="page-link" onClick={paginateNext} aria-label="Next">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>

  );
}

export default CustomerPaymentsTable;