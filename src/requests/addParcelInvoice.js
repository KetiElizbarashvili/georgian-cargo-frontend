export function addParcelInvoice(axios, data) {
    return axios.post(`/parcel/${data.id}/invoice`, data.data);
}
