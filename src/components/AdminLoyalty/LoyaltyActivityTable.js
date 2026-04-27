import LoyaltyActivityItem from "./LoyaltyActivityItem";

const LoyaltyActivityTable = ({ activity }) => {
    return (
        <div className="table-responsive">
            <table className="table table-borderless align-items-center table-flush">
                <thead className="thead-light">
                    <tr>
                        <th className="border-bottom" scope="col">Id</th>
                        <th className="border-bottom" scope="col">Type</th>
                        <th className="border-bottom" scope="col">Description</th>
                        <th className="border-bottom" scope="col">points</th>
                        <th className="border-bottom" scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {activity.map((act, i) => (
                        <LoyaltyActivityItem item={act} />
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default LoyaltyActivityTable;