export default function loginWithGoogle(axios, data) {
  const { token, invite } = data;
  return axios.get(`/auth/staff/google?token=${token}&invite=${invite}`, {
    token: token,
  });
}
