const allAdminParcels = (axios) => {
    return axios.get("/admin/parcel");
};

export {allAdminParcels};
