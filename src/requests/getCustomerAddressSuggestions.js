export default function getCustomerAddressSuggestions(axios, data) {
  // const {name} = data;
  return axios.post('/cargo/findInfo', data);
}