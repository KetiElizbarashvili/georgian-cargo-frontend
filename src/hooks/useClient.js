import {AuthContext} from "context";
import {useState, useEffect, useContext} from "react";
// import {toast} from "react-toastify";
import {clientDetails} from "requests/clientDetails";
import useRequest from "./useRequest";

const useClient = () => {
    const {
        auth: {accountType, isLoggedIn},
    } = useContext(AuthContext);
    const [client, setClient] = useState({});
    const [getMyData] = useRequest(clientDetails, true);

    useEffect(() => {
        if (isLoggedIn && accountType === "CLIENT")
            getMyData()
                .then(({data: r}) => {
                    if (!client.id) setClient(r.client);
                })
                .catch((e) => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const saveClientData = (request, data) => {
        request(data)
            .then((r) => {
                // toast.success("Data updated succsessfully");
                setClient({...client, ...data});
            })
            .catch((e) => {
                // toast.error("An error ocurred");
            });
    };
    return {client, saveClientData};
};

export default useClient;
