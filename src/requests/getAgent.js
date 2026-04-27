export function getAgent(axios, id){
    return axios.get(`/agent/${id}`);
}
