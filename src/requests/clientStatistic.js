export default function clientStatisticRequest(axios, data) {
  const { clientId } = data;
  return axios.get(`/statistics/customer?id=` + clientId.toString());
}
