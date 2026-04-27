import {history} from "components/History";

const backURL = () => {
    const pathname = history.location.pathname;
    const arr = pathname.split("/");
    let back = "";
    for (let i = 1; i < arr.length - 1; i++) {
        const path = arr[i];
        back = back + "/" + path;
    }
    return back;
};
export default backURL;
