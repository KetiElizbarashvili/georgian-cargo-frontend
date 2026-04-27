import {useContext, useEffect} from "react";
import {Redirect} from "react-router";
import {AuthContext} from "../../context";

function AdminLogout() {
    const {setAuth} = useContext(AuthContext);

    useEffect(()=>{
        setAuth({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Redirect to="/manage/login" />
    );
}

export default AdminLogout;
