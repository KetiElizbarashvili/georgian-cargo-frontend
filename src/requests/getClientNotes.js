export default function getClientNotes(axios, data) {
  const {start, limit, email} = data;
  return axios.get(`/staff/client-notes`, {
    params: {
      start: start,
      limit: limit,
      email: email
    },
  });
}
