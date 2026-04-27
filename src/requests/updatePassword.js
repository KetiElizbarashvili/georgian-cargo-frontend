export default function updatePassword(axios, data) {
  const {current_password, password, confirm_password, token} = data;
  return axios.post(`/auth/update/password`, {
    current_password: current_password, 
    password: password, 
    confirm_password: confirm_password,
    token: token,
  });
}
