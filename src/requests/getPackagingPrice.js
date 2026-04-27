export default function getPackagingPrice(axios, data) {
  return axios.get(`/config/packaging`);
}