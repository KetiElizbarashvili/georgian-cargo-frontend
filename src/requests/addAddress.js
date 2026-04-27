export function addAddress(axios, data) {
    return axios.post("/location", data);
}
