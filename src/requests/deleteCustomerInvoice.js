export function deleteCustomerInvoiceRequest(axios, data) {
  return axios.post('/customer/invoice/delete', data);
}
