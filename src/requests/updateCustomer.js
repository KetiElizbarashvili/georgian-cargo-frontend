export default function updateCustomer(axios, data) {
  const { name, phone, username, customer_type } = data;
  return axios.post(`/customer/profile/update`, { name: name, phone: phone, username: username, customer_type: customer_type });
}
