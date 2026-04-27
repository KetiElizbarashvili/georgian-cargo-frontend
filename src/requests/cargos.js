export default function cargosRequest(axios, data) {
  const { start, payment_status, query, limit } = data;
  console.log(data);
  return axios.get(`/customer/cargos`, {
    params: {
      start: start,
      limit: limit,
      ...(payment_status ? { payment_status: payment_status } : {}),
      ...(query ? { query: query } : {}),
    },
  });
}
