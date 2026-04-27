export default function contactUs(axios, data) {
  return axios.post("/contact", data);
}
