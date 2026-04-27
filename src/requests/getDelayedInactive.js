export default function getDelayedInactive(axios, data) {
    const { start, limit, time, time_by, registered } = data;
    return axios.get(`/statistics/inactive-delayed/?start=${start}&limit=${limit}&time=${time}&time_by=${time_by}&registered=${registered}`);
}