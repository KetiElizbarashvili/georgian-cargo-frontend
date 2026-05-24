export default function getRoutePairs(axios) {
    return axios.get('/routes/pairs');
}
