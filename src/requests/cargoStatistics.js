export default function cargoStatisticsRequest(axios, data) {
  const { paymentstatus, paymentmethod, datefrom, dateto, collection, status, route, agent, interval  } = data;
  return axios.get(`/statistics`, {
    params: {
      interval: interval,
      ...(paymentstatus ? { paymentstatus: paymentstatus } : {}),
      ...(paymentmethod ? { paymentmethod: paymentmethod } : {}),
      ...(datefrom ? { datefrom: datefrom } : {}),
      ...(dateto ? { dateto: dateto } : {}),
      ...(collection ? { collection: collection } : {}),
      ...(status ? { status: status } : {}),
      ...(route ? { route: route } : {}),
      ...(agent ? { agent: agent } : {}),
    },
  });
}
