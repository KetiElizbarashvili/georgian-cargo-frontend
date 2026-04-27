import ClientNav from "components/ClientNav/ClientNav";
import { ClientFooter } from "components/Footer";
import ClientCouponsTable from "./ClientCouponsTable";

const ClientCoupons = ({ user }) => {
    return user && (
        <>
            <main id="content" className="mt-lg-0 mt-xl-8 mt-xxl-8 bg-light" style={{ minWidth: "308px" }}>
                <div className="container ">
                    <div className="row">
                        <div className="col-md-3 col-sm-2 col-12 mb-4" style={{ minWidth: "50px" }}>
                            <ClientNav user={user} />
                        </div>
                        <div className="col-md-9 col-sm-10 col-12">
                            <ClientCouponsTable />
                        </div>
                    </div>
                </div>
                <ClientFooter />
            </main>
        </>
    );
};

export default ClientCoupons;