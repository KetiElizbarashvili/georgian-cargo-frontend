export default function verifyCustomerEmail(axios, data) {
  const { token } = data;
  return axios.get(`/auth/customer/verification/${token}`);
}
