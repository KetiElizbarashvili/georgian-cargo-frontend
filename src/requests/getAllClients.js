export function getAllClients(axios) {
    return axios.get(`/admin/client`);
}
