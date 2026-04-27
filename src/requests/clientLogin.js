export function clientLogin(axios, data) {
  return axios.post("/auth/staff", data);
}
