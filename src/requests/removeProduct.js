export function removeProduct(axios, data) {
    return axios.delete(`/product/${data.id}`);
}
