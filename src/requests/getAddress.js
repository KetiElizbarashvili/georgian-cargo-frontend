export function getAddress(axios, id){
    return axios.get(`/location/${id}`);
}
