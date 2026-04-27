export default function saveClientNote(axios, data) {
  const {note, email} = data;
  return axios.post(`/staff/client-notes`, {
      note: note,
      email: email
  });
}
