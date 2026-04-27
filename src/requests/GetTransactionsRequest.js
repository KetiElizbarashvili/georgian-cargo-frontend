function GetTransactionsRequest(axios, payload) {
    return axios.post('/billing/payments', { start: payload.start, status: payload.status });
}

export default GetTransactionsRequest;
