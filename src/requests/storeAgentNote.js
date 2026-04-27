export default function storeAgentNote(axios, data) {
    return axios.post(`/staff/cargo/${data.id}/notes`, data);
}
