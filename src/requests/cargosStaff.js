export default function cargosStaffRequest(axios, data) {
  const { start, payment_status, query, customerId, limit } = data;
  console.log(data);
  return axios.get(`/staff/cargos`, {
    params: {
      start: start,
      limit: limit,
      customer_id: customerId,
      ...(payment_status ? { payment_status: payment_status } : {}),
      ...(query ? { query: query } : {}),
    },
  });
}
