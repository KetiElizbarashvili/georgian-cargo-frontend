export function adminDeleteParcel(axios, id) {
    return axios.delete(`/admin/parcel/${id}`);
}
