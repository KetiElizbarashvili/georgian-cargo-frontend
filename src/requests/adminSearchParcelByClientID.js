export function adminSearchParcelByClientID(axios, {term, isAdmin}) {
    if (isAdmin) {
        return axios.get(`/admin/parcel/client/${term}`);
    } else {
        return axios.get(`/agent/parcel/client/${term}`);
    }
}
