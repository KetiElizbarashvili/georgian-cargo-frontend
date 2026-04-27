export default function storeBookingAgentNote(axios, data) {
    return axios.post(`/staff/store/notes`, data);
}
