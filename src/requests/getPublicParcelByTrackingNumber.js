export function getPublicParcelByTrackingNumber(axios, id) {
    return axios.post(`/cargo/track`, { tracking_number: id });
}
