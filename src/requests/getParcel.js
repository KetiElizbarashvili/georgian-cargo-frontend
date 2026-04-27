export function getParcel(axios, id) {
    return axios.get(`/parcel/${id}`);
}
