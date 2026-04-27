export function adminGetParcel(axios, id) {
    return axios.get(`/admin/parcel/${id}`);
}
