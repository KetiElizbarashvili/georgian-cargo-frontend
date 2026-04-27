export default function markCargoNotesSeen(axios, data) {
    return axios.post("/cargo/notes/seen", data);
}
