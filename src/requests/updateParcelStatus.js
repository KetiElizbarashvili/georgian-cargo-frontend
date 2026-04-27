export function updateParcelStatus(axios, data) {
    return axios.put(`/agent/parcel/${data.id}`, data);
}
