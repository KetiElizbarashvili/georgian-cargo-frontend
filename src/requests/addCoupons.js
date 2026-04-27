export default function addCoupons(axios, data) {
    return axios.post("/cargo/coupons", data);
}
