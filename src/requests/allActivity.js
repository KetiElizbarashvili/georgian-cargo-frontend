export function allActivity(axios, data) {
    const { start, limit } = data;
    return axios.get(`/activity?start=${start}&limit=${limit}`);
}
