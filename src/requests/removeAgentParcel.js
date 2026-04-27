export function removeAgentParcel(axios, data) {
    return axios.delete(`/agent/parcel/${data.id}`);
}
