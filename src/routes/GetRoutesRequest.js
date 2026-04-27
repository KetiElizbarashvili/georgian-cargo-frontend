export function GetItemsRequest(axios) {
    return axios.get('/routes');
}
export function GetItemRequest(axios, { source, destination }) {
    return axios.post('/route', { source, destination });
}

export function updateItemRequest(axios, route) {
    console.log(route);
    return axios.post('/route/updatePolicies', { ...route });
}

export function updateRouteRequest(axios, route) {
    return axios.post('/route/update', { ...route });
}
