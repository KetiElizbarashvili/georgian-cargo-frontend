export function removeAgent(axios, data) {
    return axios.delete(`/agent/${data.id}`);
}
