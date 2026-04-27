export default function saveLoyaltySettings(axios, data) {
    return axios.post("/loyalty/settings/save", data);
}
