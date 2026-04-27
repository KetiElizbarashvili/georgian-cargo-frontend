export default function deleteBookingAgentNote(axios, data) {
    return axios.post(`/staff/notes/delete`, data);
}
