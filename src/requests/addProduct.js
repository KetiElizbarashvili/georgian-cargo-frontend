export function addProduct(axios, data) {
    return axios.post('/product', data);
}
