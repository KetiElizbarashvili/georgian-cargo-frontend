export default function storeBookingClientNote(axios, data) {
    return axios.post(`/customer/store/notes`, data);
}
