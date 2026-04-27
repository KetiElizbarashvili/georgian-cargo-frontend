export function removeAddress(axios, data) {
    return axios.delete(`/location/${data.id}`, data);
}
