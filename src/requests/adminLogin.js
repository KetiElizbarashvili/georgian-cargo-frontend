export function adminLogin(axios, data) {
    return axios.post("/auth/admin/login", data);
}
