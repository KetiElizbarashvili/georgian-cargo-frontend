export default function clientSaveCoupon(axios, data) {
    return axios.post(`/customer/store/coupon`, data);
}
