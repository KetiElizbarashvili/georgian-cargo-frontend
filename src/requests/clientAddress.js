export default function clientAddress(axios, data) {
  return axios.get(`/customer/address`);
}
