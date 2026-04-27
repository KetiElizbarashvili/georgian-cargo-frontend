export function addAgent(axios, data) {
    return axios.post("/agent", data);
}
