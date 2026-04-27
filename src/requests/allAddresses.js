const allAddresses = (axios) => {
    return axios.get("/location");
};

export { allAddresses };
