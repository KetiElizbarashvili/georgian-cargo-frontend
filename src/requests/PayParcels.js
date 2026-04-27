export default function PayParcels(axios, data) {
  const { invoice_ids, payment_method } = data;

  const payload = { invoice_ids: invoice_ids, payment_method: payment_method };

  switch (payment_method) {
    case "ONLINE":
      return axios.post("/billing/payment/method/stripe", payload);
    case "CASH":
      return axios.post("/billing/payment/cash", payload);
    case "BANK":
      return axios.post("/billing/payment/bank", payload);
    default:
      break;
  }
}