export default function updatePackagingPrice(axios, data) {
  const {packaging_price} = data;
  console.log(packaging_price);
  return axios.post(`/config/packaging/update`, {packaging_price: packaging_price});
}
