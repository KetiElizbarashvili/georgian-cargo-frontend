export default function storeBookingAgentNote(axios, data) {
    return axios.post(`/staff/cargo/${data.id}/notes`, data);
}
