export default function cargoPicturesRequest(axios, data) {
  const { trackingNumber } = data;
  return axios.get(`/pictures?tracking_number=` + trackingNumber);
}
