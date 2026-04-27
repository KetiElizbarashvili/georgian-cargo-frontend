export default function deleteCargoNote(axios, data) {
    return axios.post(`/staff/cargo/notes/${data.id}/delete`, data);
}
