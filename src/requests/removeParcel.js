export function removeParcel(axios, data) {
    return axios.delete(`/parcel/${data.id}`);
}
