export function changePassword(axios, data) {
  return axios.post("/auth/customer/password/reset", data);
}
