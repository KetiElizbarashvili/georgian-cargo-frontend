export default function getBookings(axios, data) {
  const {start} = data;
  return axios.get(`/customer/bookings`, {
    params: {
      start: start
    },
  });
}
