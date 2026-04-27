export function getParcelByTrackingNumber(axios, data) {
    const {id, type} = data;
    return axios.get(`/${type}/parcel/tracking_number/${id}`);
}
