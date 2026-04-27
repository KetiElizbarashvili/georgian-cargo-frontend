export function agentLogin(axios, data) {
    return axios.post("/auth/agent/login", data);
}
