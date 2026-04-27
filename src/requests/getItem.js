export default function getItem(axios, data) {
    const { tracking } = data;
    return axios.get(`/cargo/${tracking}`);
}