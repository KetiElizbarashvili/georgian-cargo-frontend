export default function markBookNotesSeen(axios, data) {
    return axios.post("/booking/notes/seen", data);
}
