export function adminGetTopupHistory(axios, id) {
    return axios.get(`/admin/${id}/topup`);
}
