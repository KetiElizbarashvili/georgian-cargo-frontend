export default function savePublicBooking(axios, data) {
  return axios.post("/public/booking", data);
}
