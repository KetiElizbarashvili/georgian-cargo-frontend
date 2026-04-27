export function setCommentRead(axios, data) {
    if (data.isClient) {
        return axios.post(`/parcel/read/${data.id}`);
    } else {
        return axios.post(`/agent/parcel/read/${data.id}`);
    }
}
