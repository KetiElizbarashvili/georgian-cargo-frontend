export default function agentGetAllBookings(axios, data) {
  const { start, status, dateFrom, dateTo, q } = data;
  return axios.get(`/staff/bookings/all?status=${status}&dateFrom=${dateFrom}&dateTo=${dateTo}&q=${q}`);
}
