import React, { useEffect, useState } from "react";
import { Col, Row, Button, Table } from "react-bootstrap";
import "./TransactionsTable.css";
import useRequest from "../../hooks/useRequest";
import GetTransactionsRequest from "../../requests/GetTransactionsRequest";
import { currency_symbols } from '../../utils/Currency';
import { Link } from "react-router-dom";
function TransactionsTable() {
  const [transactionsFilter, setTransactionsFilter] = useState({
    start: 0, status: 'ALL'
  });
  const [transactions, setTransactions] = useState([]);
  const [getTransactions] = useRequest(GetTransactionsRequest);

  const handleGetPayments = () => {
    getTransactions({ start: transactionsFilter.start, status: transactionsFilter.status }).then(({ data }) => {
      setTransactions([]);
      setTransactions(data.payments);
    }).catch((e) => {
      console.log(e);
    });
  };
  useEffect(() => {
    handleGetPayments();
  }, [transactionsFilter.start]);

  const handleNext = () => {
    setTransactionsFilter({ ...transactionsFilter, start: (parseInt(transactionsFilter.start) + 20) });
  };

  const handlePrev = () => {
    let strt = parseInt(transactionsFilter.start) < 20 ? 0 : parseInt(transactionsFilter.start) - 20;
    setTransactionsFilter({ ...transactionsFilter, start: strt });
  };


  return (
    <>

      <h1>Transactions</h1>
      <Row className={"mb-3"}>
        <Col xs={6} md={4} lg={2}>
          <label htmlFor="paymentFilter">Payment Status</label>
          <select className={"form-control"} id="paymentFilter"
            value={transactionsFilter.status}
            onChange={({ target: { value } }) => { setTransactionsFilter({ ...transactionsFilter, status: value }) }}
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="ALL">All</option>
          </select>
        </Col>

        <Col xs={4} className="d-flex align-items-end btn-group">
          <Button variant={"primary"} block onClick={() => handleGetPayments()}>Filter</Button>
        </Col>
      </Row>
      {transactions && (transactions?.length > 0 || transactions !== undefined) && (
        <div className="text-center">
          <nav aria-label="Page navigation" className="d-inline-block">
            <ul className="pagination">
              <li className={"page-item" + (transactionsFilter.start == "0" ? " disabled" : "")}>
                <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
              </li>
              <li className={"page-item" + (transactions.length < 20 ? " disabled" : "")}>
                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
      <Table responsive striped bordered hover className={"items-table"}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Invoice Id</th>
            <th>Amount/Currency</th>
            <th>Payment method</th>
            <th>Payment status</th>
            <th>Cargo created at or Paid at</th>
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.length > 0 && transactions.map((transaction) => {
            return (
              <tr key={transaction.item_id}>
                <td><Link className="text-dark" to={`/manage/client/${btoa(transaction.sender_email)}`}>{transaction.name} <i className="bi bi-box-arrow-up-right"></i></Link></td>
                <td>{transaction.sender_email}</td>
                <td>{transaction.invoice_id ?? <span class="badge bg-warning">Pending</span>}</td>
                <td>
                  {transaction.invoice_id ? currency_symbols(transaction.currency) : currency_symbols(transaction.invoice_currency_code)}
                  {transaction.invoice_id ? transaction.cargo_total_price.toFixed(2) : transaction.cargo_total_price.toFixed(2)}
                </td>
                <td>{transaction.method ? (
                  (transaction.method === 'STRIPE') ? (
                    (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stripe" viewBox="0 0 16 16">
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm6.226 5.385c-.584 0-.937.164-.937.593 0 .468.607.674 1.36.93 1.228.415 2.844.963 2.851 2.993C11.5 11.868 9.924 13 7.63 13a7.662 7.662 0 0 1-3.009-.626V9.758c.926.506 2.095.88 3.01.88.617 0 1.058-.165 1.058-.671 0-.518-.658-.755-1.453-1.041C6.026 8.49 4.5 7.94 4.5 6.11 4.5 4.165 5.988 3 8.226 3a7.29 7.29 0 0 1 2.734.505v2.583c-.838-.45-1.896-.703-2.734-.703Z" />
                    </svg>)
                  ) : (

                    <i title={transaction.method} className={`bi bi-${transaction.method.toLowerCase()}`}></i>
                  )
                ) : (<span class="badge bg-warning">Pending</span>)}</td>

                <td>{transaction.method ? (
                  <span class="badge bg-success">Paid</span>
                ) : (
                  <span class="badge bg-warning">Pending</span>
                )}</td>
                <td>{transaction.created_at ?? transaction.cargo_created_at}</td>
              </tr>
            );
          })}
        </tbody>
      </Table >
      {transactions && (transactions?.length > 0 || transactions !== undefined) && (
        <div className="text-center">
          <nav aria-label="Page navigation" className="d-inline-block">
            <ul className="pagination">
              <li className={"page-item" + (transactionsFilter.start == "0" ? " disabled" : "")}>
                <a className="page-link" onClick={handlePrev} aria-label="Previous">Prev</a>
              </li>
              <li className={"page-item" + (transactions.length < 20 ? " disabled" : "")}>
                <a className="page-link" onClick={handleNext} aria-label="Next">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}

export default TransactionsTable;
