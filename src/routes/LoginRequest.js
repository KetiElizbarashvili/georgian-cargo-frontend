function LoginRequest(axios, {username, password}){
    return axios.post("/auth/staff", {
        username,password
    })
}

export default LoginRequest;