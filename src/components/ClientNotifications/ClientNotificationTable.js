import { capitalize } from "@mui/material";
import { useRequest } from "hooks";
import { useEffect, useState } from "react";
import clientNotificationSettings from "requests/clientNotificationSettings";
import updateClientNotificationSettings from "requests/updateClientNotificationSettings";
import { toast } from "react-toastify";

const ClientNotificationsTable = () => {
    const [getClientNotificationSettings] = useRequest(clientNotificationSettings);
    const [handleUpdateClientNotificationSettings] = useRequest(updateClientNotificationSettings);
    const [notificationSettings, setNotificationSettings] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getClientNotificationSettings()
            .then((response) => {
                setNotificationSettings({
                    notifications: response.data.defaults.map(n => {
                        let nt = response.data.notifications.find(nt => nt.name === n.name);
                        if (nt) {
                            return nt;
                        } else {
                            return n;
                        }
                    }),
                    defaults: response.data.defaults
                });
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setNotificationSettings({
            ...notificationSettings, notifications: notificationSettings.notifications.map(n => {
                if (n.name === e.target.name) {
                    n.value = 1 - n.value;
                    return n;
                }
                return n;
            })
        });
        handleUpdateClientNotificationSettings({ name: e.target.name, value: e.target.checked ? 1 : 0 })
            .then((response) => {
                if (response.status) {
                    toast.success("Settings updated!");
                } else {
                    toast.error("Error occured!");
                }
            });
    };

    useEffect(() => {
        console.log(notificationSettings);
    }, [notificationSettings]);


    return (
        <div className="d-grid gap-3 gap-lg-5">
            <div className="card">
                <div className="card-header border-bottom">
                    <h4 className="card-header-title">Notifications</h4>
                </div>
                <div className="card-body">
                    {!loading && notificationSettings && notificationSettings.defaults && (
                        <>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedPasswordChanged" checked disabled />
                                <label className="form-check-label" for="flexSwitchCheckCheckedPasswordChanged">Password reset</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedPasswordChanged" checked disabled />
                                <label className="form-check-label" for="flexSwitchCheckCheckedPasswordChanged">Payment emails</label>
                            </div>
                            {notificationSettings.defaults.map((set) => (
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        name={set.name}
                                        id={set.name}
                                        checked={notificationSettings.notifications.find(ee => ee.name === set.name).value === 1}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" for={set}>{capitalize(set.name.toLowerCase().replaceAll('_', ' '))}</label>
                                </div>
                            ))}
                            {/* <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedPasswordChanged" checked={notificationSettings.find(s => s.name === 'PASSWORD_CHANGED')?.value === 1} />
                                <label className="form-check-label" for="flexSwitchCheckCheckedPasswordChanged">Password changed</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedParcelNotes" checked />
                                <label className="form-check-label" for="flexSwitchCheckCheckedParcelNotes">Parcel notes shared</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedInvoice" checked disabled />
                                <label className="form-check-label" for="flexSwitchCheckCheckedInvoice">Payment emails</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedPaymentConfirmation" checked />
                                <label className="form-check-label" for="flexSwitchCheckCheckedPaymentConfirmation">Payment confirmation</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedParcelCreated" checked />
                                <label className="form-check-label" for="flexSwitchCheckCheckedParcelCreated">Parcel created</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedBookingCreated" checked />
                                <label className="form-check-label" for="flexSwitchCheckCheckedBookingCreated">Booking created</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedDeliveryConfirmation" checked />
                                <label className="form-check-label" for="flexSwitchCheckCheckedDeliveryConfirmation">Delivery confirmation</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedParcelStatus" checked />
                                <label className="form-check-label" for="flexSwitchCheckCheckedParcelStatus">Parcel status update</label>
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedBookingStatus" checked />
                                <label className="form-check-label" for="flexSwitchCheckCheckedBookingStatus">Booking status update</label>
                            </div> */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientNotificationsTable;