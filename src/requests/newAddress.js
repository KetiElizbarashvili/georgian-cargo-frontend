export default function newAddress(axios, data) {
  const {name, email, phone, address_country_code, address_line_1, address_line_2, address_postal_code} = data;
  return axios.post(`/customer/address`, {
    name: name, 
    email: email, 
    phone: phone,
    address_country_code: address_country_code,
    address_line_1: address_line_1,
    address_line_2: address_line_2,
    address_postal_code: address_postal_code
  });
}
