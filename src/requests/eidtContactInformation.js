export function editContactInformation(axios, data) {
    return axios.post(`/cargo/${data.id}/info/edit`, data);
}
