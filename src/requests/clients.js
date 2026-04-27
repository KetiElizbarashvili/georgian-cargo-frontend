export default function clientsRequest(axios, data) {
  const { datefrom, dateto, route  } = data;
  return axios.get(`/statistics/customers?currency=gbp,eur`, {
    params: {
      ...(datefrom ? { datefrom: datefrom } : {}),
      ...(dateto ? { dateto: dateto } : {}),
      ...(route ? { route: route } : {}),
    },
  });
}
