export default function shareBookingNotes(axios, data) {
    return axios.post(`/staff/notes/share`, data);
}
