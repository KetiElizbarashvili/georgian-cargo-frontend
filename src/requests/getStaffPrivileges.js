export function getStaffPrivileges(axios, data) {
    return axios.get(`/staff/privileges`);
}
