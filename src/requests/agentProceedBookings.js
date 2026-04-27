export default function agetProceedBookings(axios, data) {
  const { booking_ids, status, courier_phone, courier_note } = data;
  return axios.post(`/staff/bookings/proceed`, {
    booking_ids: booking_ids,
    status: status,
    ...(courier_phone ? { courier_phone: courier_phone } : {}),
    ...(courier_note ? { courier_note: courier_note } : {}),
  });
}
