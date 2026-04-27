export function updateStaff(axios, data) {
    return axios.post(`/staff/update`, data);
}
