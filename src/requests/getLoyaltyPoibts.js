export default function getLoyaltyPoints(axios) {
    return axios.get(`/loyalty/points`);
}