export function allCurrencies(axios) {
    return axios.get(`/currencies`);
}
