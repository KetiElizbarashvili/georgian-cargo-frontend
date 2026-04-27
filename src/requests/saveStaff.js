export function saveStaff(axios, data) {
    return axios.post("/staff/save", data);
}
