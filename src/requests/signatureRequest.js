export default function signatureRequest(axios, data) {
  const { trackingNumber } = data;
  return axios.get(`/signature?tracking_number=` + trackingNumber);
}
