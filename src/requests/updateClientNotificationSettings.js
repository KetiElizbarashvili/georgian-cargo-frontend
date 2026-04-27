export default function updateClientNotificationSettings(axios, data) {
    const { name, value } = data;
    return axios.post(`/customer/settings/notifications`, { name: name, value: value });
}
