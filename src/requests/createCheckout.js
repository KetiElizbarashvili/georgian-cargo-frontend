export function createCheckout(axios, amount) {
    return axios.post('/stripe/create-checkout', {amount});
}
