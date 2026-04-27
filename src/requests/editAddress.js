export function editAddress(axios, data) {
    return axios.put(`/location/${data.id}`, data);
}
