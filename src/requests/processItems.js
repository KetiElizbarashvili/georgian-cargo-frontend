export function processItems(axios, data) {
    console.log(data);
    return axios.post(`/cargo/batch/event`, data);
}
