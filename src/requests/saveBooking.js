export default function saveBooking(axios, data) {
  console.log(data);
  return axios.post("/customer/booking", data);
}
