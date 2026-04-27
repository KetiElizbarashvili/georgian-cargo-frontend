export default function getStaff(axios, data) {
    return axios.get(`/staff/get?start=${data.start}`);
}