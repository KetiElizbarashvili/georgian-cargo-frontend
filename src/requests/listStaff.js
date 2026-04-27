export function listStaff(axios, data) {
    return axios.get(`/staff?start=${data.start}&limit=${data.limit}`);
}
