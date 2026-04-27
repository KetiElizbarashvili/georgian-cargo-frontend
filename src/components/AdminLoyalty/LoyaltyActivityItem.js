import { Link } from "react-router-dom";
import moment from "moment";
import { currency_symbols } from "utils/Currency";

const LoyaltyActivityItem = ({ item }) => {
    return (
        <tr key={item.id}>
            <th className="text-gray-900" scope="row">{item.id}</th>
            <td className="text-gray-300">
                {item.type === 'SHARE' && (
                    <>
                        <i style={{ fontSize: "20px" }} className="bi bi-share"></i>
                    </>
                )}
                {item.type === 'INVITE' && (
                    <>
                        <i style={{ fontSize: "20px" }} className="bi bi-person"></i>
                    </>
                )}
                {item.type === 'INVITE_USED' && (
                    <>
                        <i style={{ fontSize: "20px" }} className="bi bi-person-check"></i>
                    </>
                )}

            </td>
            <td className="text-gray-300">
                {item.type === 'SHARE' && (
                    <>
                        <b><Link to={`/manage/client/${JSON.parse(item.data).id}`}>{JSON.parse(item.data).name}</Link></b> has shared link
                    </>
                )}

                {item.type === 'INVITE' && (
                    <>
                        <b><Link to={`/manage/client/${JSON.parse(item.data).a_id}`}>{JSON.parse(item.data).a_name}</Link></b> has invited <b><Link to={`/manage/client/${JSON.parse(item.data).i_id}`}>{JSON.parse(item.data).i_name}</Link></b>
                    </>
                )}
                {item.type === 'INVITE_USED' && (
                    <>
                        <b><Link to={`/manage/client/${JSON.parse(item.data).i_id}`}>{JSON.parse(item.data).i_name}</Link></b> has used service <b><Link to={`/manage/item/${JSON.parse(item.data).tracking}`}>{JSON.parse(item.data).tracking}</Link></b>, so <b><Link to={`/manage/client/${JSON.parse(item.data).a_id}`}>{JSON.parse(item.data).a_name}</Link></b> got points
                    </>
                )}

            </td>
            <td>{JSON.parse(item.data).points}</td>
            <td
                title={moment(item.created_at).format(
                    "D MMMM, YYYY, h:mm:ss a"
                )}
                className="fw-bolder text-gray-500">
                {
                    moment(item.created_at).fromNow()
                }
            </td>
        </tr>
    );
};

export default LoyaltyActivityItem;