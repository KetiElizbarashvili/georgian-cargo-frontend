export function updateAgent(axios, data){
    return axios.put(`/agent/${data.id}`, data);
}
