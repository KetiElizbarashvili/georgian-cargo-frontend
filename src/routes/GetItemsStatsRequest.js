function GetItemsStatsRequest(axios, {filter_value, filter_by = "ALL"}){
    console.log(filter_value, filter_by);
    return axios.post('/cargoStats', {
        filter_specification: {
            filter_value,
            filter_by: filter_by
        }
    });
}

export default GetItemsStatsRequest;
