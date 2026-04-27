export default function getParcelPrice(axios, data) {
  return axios.post("/cargo/price/calculate", data);
}
