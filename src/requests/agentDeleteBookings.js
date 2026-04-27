export default function agentDeleteBookings(axios, data) {
    const { ids } = data;
    return axios.post(`/staff/booking/items/delete`, {
        ids: ids,
    });
}
