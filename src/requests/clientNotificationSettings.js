export default function clientNotificationSettings(axios) {
    return axios.get(`/customer/settings/notifications`);
}
