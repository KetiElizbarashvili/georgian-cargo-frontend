const clientApplyCouponOnParcel = (axios, data) => {
    return axios.post(`/cargo/applycoupon`, data);
};

export default clientApplyCouponOnParcel;