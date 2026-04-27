export function loyaltyActivity(axios, data) {
    const { start, limit } = data;
    return axios.get(`/loyalty/activity?start=${start}&limit=${limit}`);
}
