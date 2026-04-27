export function resetPassword(axios, data) {
    return axios.post(`/client/reset_password`, data);
}
