export default function clientReceivers(axios, data) {
  const { start, country_code } = data;
  return axios.get(`/customer/address/receivers`, {
    params: {
      country_code: country_code
    },
  });
}
