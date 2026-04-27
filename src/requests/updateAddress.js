export function updateAddress(axios, data){
    return axios.put(`/address/${data.id}`, data);
}
