export default function calculateCargoPricesPublic(axios, data) {
    return axios.post("/prices/calculate", data);
}
