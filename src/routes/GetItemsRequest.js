function GetItemsRequest(axios, {filter_value, filter_by = "ALL", page_offset= 0, page_size=50}){
    return axios.post('/cargo', {
        filter_specification: {
            filter_value,
            filter_by: filter_by
        },
        paging_specification: {
            page_offset,
            page_size
        }
    });
}

export default GetItemsRequest;
