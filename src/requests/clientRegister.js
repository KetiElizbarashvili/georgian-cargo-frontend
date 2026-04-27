export function clientRegister(axios, data) {
  return axios.post("/auth/customer/signup", data);
}
