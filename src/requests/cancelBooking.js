export default function cancelBooking(axios, data) {
  const {id} = data;
  return axios.post("/customer/booking/cancel", {id: id});
}
