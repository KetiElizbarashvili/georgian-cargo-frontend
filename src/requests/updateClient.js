export function updateClient(axios, data) {
    return axios.put(`/client`, data);
}
