export default function forgotPassword(axios, data) {
  return axios.post("/auth/customer/password/request/reset", data);
}
