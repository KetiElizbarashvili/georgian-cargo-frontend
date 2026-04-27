import ActivityTable from "./activityTable";
import AllActivityTable from "./allActivityTable";

function ActivityBlock({ data, loading }) {
    return (
        <>
            <div className="card border-0 shadow">
                <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom">
                    <div className="d-block">
                        <h2 className="h3 fw-extrabold">Activity log</h2>
                    </div>
                </div>
                <div className="card-body p-2">
                    <ActivityTable
                        data={data}
                        loading={loading} />
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#allActivity">View all</button>
                </div>
            </div>
            <div class="modal fade" id="allActivity" tabindex="-1" aria-labelledby="allActivityLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="allActivityLabel">All activity</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <AllActivityTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ActivityBlock;