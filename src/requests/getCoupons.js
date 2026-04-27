export default function getCoupons(axios, data) {
    return axios.get(`/cargo/coupons?start=${data.start}&query=${data.query}&limit=${data.limit}`, data);
}
