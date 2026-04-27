export default function deleteCoupons(axios, data) {
    return axios.post(`/cargo/coupons/delete`, data);
}
