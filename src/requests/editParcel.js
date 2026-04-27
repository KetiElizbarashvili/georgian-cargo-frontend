export function editParcel(axios, data) {
    return axios.put(`/parcel/${data.id}`, data);
}
