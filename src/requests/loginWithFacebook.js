export default function loginWithFacebook(axios, data) {
  const { token, id, invite } = data;
  return axios.get(`/auth/staff/facebook?token=${token}&id=${id}&invite=${invite}`, {
    token: token,
  });
}
