const clientCoupons = (axios, data) => {
    return axios.get(`/customer/coupons?start=${data.start}&limit=${data.limit}`);
};

export default clientCoupons;