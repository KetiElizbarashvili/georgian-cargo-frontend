export default function giveCoupons(axios, data) {
    return axios.post(`/cargo/coupons/give`, data);
}
