export default function clientActivity(axios, data) {
    const { id, start } = data;
    return axios.get(`/customer/activity?start=${start}&id=${id}`);
}
