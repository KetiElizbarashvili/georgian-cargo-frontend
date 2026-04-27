export default function agentGetBookings(axios, data) {
  const { start, status, dateFrom, dateTo, q, source_country } = data;
  return axios.get(`/staff/bookings?start=${start}&status=${status}&dateFrom=${dateFrom}&dateTo=${dateTo}&q=${q}&source_country=${source_country}`);
}
