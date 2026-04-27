import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Modal } from "react-bootstrap";
import { getPublicParcelByTrackingNumber } from "requests";
import { processItems } from "requests/processItems";
import { useRequest } from "hooks";
import { toast } from "react-toastify";

export const HandleCargo = () => {
    const [getTrackingHistory] = useRequest(getPublicParcelByTrackingNumber);
    const [processItemsReq] = useRequest(processItems);
    const [barCode, setBarCode] = useState(null);
    const [scaning, setScaning] = useState(false);
    const [typing, setTyping] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [bulkNumber, setBulkNumber] = useState(1);
    const [trackings, setTrackings] = useState([]);
    const [warning, setWarning] = useState(null);

    const bulkAddItems = () => {
        let number = (barCode.match(/\d+$/g))[0];
        let startsWith0 = (number[0] === '0');
        console.log(startsWith0);
        let other = barCode.slice(0, -number.toString().length);
        let trsk = [...trackings];
        for (let i = 0; i < bulkNumber; i++) {
            let num = startsWith0 ? '0' + (parseInt(number) + i) : (parseInt(number) + i);
            trsk.push({ tracking: `${other}${num}`, status: null });
        }
        setTrackings(trsk.sort(function (a, b) {
            return a.tracking.localeCompare(b.tracking)
        }));
        setBarCode(null);
    };

    const removeFromList = (track) => {
        let trs = [...trackings].filter(x => x.tracking.toString() !== track.toString());
        setTrackings(trs.sort(function (a, b) {
            return a.tracking.localeCompare(b.tracking)
        }));
    };

    const checkIfMissing = () => {
        if (trackings.length > 0) {
            let len = trackings.length;
            let number = (trackings[0].tracking.match(/\d+$/g))[0];
            for (let i = 0; i < len; i++) {
                if (trackings[i + 1] !== undefined && i < len && ((trackings[i + 1].tracking.match(/\d+$/g))[0] - (trackings[i].tracking.match(/\d+$/g))[0]) !== 1) {
                    setWarning(`Item missing after ${trackings[i].tracking}`);
                    return;
                } else {
                    setWarning(null);
                }
            }
        }
    };

    const handleProcessItems = (type) => {
        if (trackings.length < 1) {
            toast.error(
                "select at least one!"
            );
            return;
        }
        setProcessing(true);
        processItemsReq({ tracking_numbers: trackings.map(x => x.tracking), event: type })
            .then((response) => {
                if (!response.data.error) {
                    toast.success(
                        "Status updated!"
                    );
                    setTrackings([]);
                } else {
                    toast.error(
                        "error occured!"
                    );
                }
                setProcessing(false);
            });
    };

    useEffect(async () => {
        let trks = [...trackings];

        let a = await Promise.all(
            trks.map(async (nt) => {
                if (nt.status === null) {
                    let track = await getTrackingHistory(nt.tracking);
                    let status = track?.data?.history.sort(function (x, y) {
                        return new Date(x.time) < new Date(y.time) ? 1 : -1
                    })[0].type ?? 'unknown';
                    if (status === 'unknown') {
                        toast.error("Item not found!");
                    }
                    return { tracking: nt.tracking, status: status };
                }
                return nt;
            })
        )
        setTrackings(a.sort(function (a, b) {
            return a.tracking.localeCompare(b.tracking)
        }));

        checkIfMissing();
    }, [trackings.length]);

    return (
        <>
            <div className="text-center">
                <button
                    onClick={() => (setScaning(!scaning), typing ? setTyping(false) : '')}
                    style={{ fontSize: "20px" }}
                    className="btn btn-dark p-4 mb-2 me-2"><i className="bi bi-camera"></i> Scan Barcode</button>
                {'- '}
                <button
                    onClick={() => (setTyping(!typing), scaning ? setScaning(false) : '')}
                    style={{ fontSize: "20px" }}
                    className="btn btn-light p-4 mb-2"><i className="bi bi-pen"></i> Type Tracking</button>
                {typing && (
                    <>
                        <div className="input-group mb-3">
                            <div className="form-floating flex-grow-1">
                                <input type="text" className="form-control" name="tracking"
                                    onChange={(e) => setBarCode(e.target.value)} placeholder=" " />

                                <label for="code1">Tracking number</label>
                            </div>
                            <div className="form-floating flex-grow-1">
                                <input type="number" className="form-control" name="bulkNumber"
                                    value={bulkNumber}
                                    onChange={(e) => setBulkNumber(parseInt(e.target.value))} placeholder=" " />

                                <label for="code1">Number of items</label>
                            </div>
                            <span role="button"
                                onClick={() => bulkAddItems()}
                                className="input-group-text bg-primary text-white">Add</span>
                        </div>

                    </>
                )}
                {scaning && (
                    <BarcodeScannerComponent
                        torch={false}
                        style={{ width: '100%' }}
                        constraints={{
                            facingMode: 'environment'
                        }}
                        onUpdate={(err, result) => {
                            if (result) {
                                setBarCode(result.text);
                            }
                        }}
                    />
                )}
                <h1>{barCode}</h1>
            </div>
            {warning !== null && (
                <div className="alert bg-warning">{warning}</div>
            )}
            {(trackings && trackings.length) > 0 ? (
                <table className="table table-bordered table-striped">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tracking</th>
                            <th scope="col">Current Status</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trackings.map((tr, i) => (
                            <tr>
                                <th className={(tr.status === 'unknown' ? 'text-danger' : '')} style={{ verticalAlign: 'middle' }} scope="row">{i + 1}</th>
                                <td className={(tr.status === 'unknown' ? 'text-danger' : '')} style={{ verticalAlign: 'middle' }}>{tr.tracking}</td>
                                <td className={(tr.status === 'unknown' ? 'text-danger' : '')} style={{ verticalAlign: 'middle' }}>
                                    {tr.status === null ? (
                                        <div className="spinner-border spinner-border-sm ms-1" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : tr.status}
                                </td>
                                <td><button
                                    onClick={() => removeFromList(tr.tracking)}
                                    className="btn btn-danger"><i className="bi bi-x-lg"></i></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert bg-info text-center text-white">
                    No trackings selected, Toggle camera to start scanning
                </div>
            )}
            <div className="text-center">
                <button
                    onClick={() => handleProcessItems('PICKUP')}
                    disabled={processing || trackings.length < 1}
                    className="btn btn-dark me-2 mt-2"
                >PICKUP</button>
                <button
                    onClick={() => handleProcessItems('PROCESS')}
                    disabled={processing || trackings.length < 1}
                    className="btn btn-dark me-2 mt-2"
                >PROCESS</button>
                <button
                    onClick={() => handleProcessItems('TRANSIT')}
                    disabled={processing || trackings.length < 1}
                    className="btn btn-dark me-2 mt-2"
                >TRANSIT</button>
                <button
                    onClick={() => handleProcessItems('ARRIVE')}
                    disabled={processing || trackings.length < 1}
                    className="btn btn-dark me-2 mt-2"
                >ARRIVE</button>
                <button
                    onClick={() => handleProcessItems('RECEIVE')}
                    disabled={processing || trackings.length < 1}
                    className="btn btn-dark me-2 mt-2"
                >RECEIVE</button>
                <button
                    onClick={() => handleProcessItems('DELAY')}
                    disabled={processing || trackings.length < 1}
                    className="btn btn-dark me-2 mt-2"
                >DELAY</button>
            </div>

            <Modal
                size="xxl"
                onHide={() => setBarCode(null)}
                show={barCode !== null && scaning}
                fullscreen={true}
                aria-labelledby="create-route-title"
                backdrop="static"
                centered
            >
                <Modal.Header closeButton />

                <Modal.Body className="pt-0">
                    Found <b>{barCode}</b> <br />
                    Do you want to add it to the list?
                    <hr />
                    <div className="form-floating flex-grow-1">
                        <input type="number" className="form-control" name="bulkNumber"
                            value={bulkNumber}
                            onChange={(e) => setBulkNumber(parseInt(e.target.value))} placeholder=" " />

                        <label for="code1">Number of items</label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success"
                        onClick={() => bulkAddItems()}>Yes</button>
                    <button className="btn btn-danger"
                        onClick={() => setBarCode(null)}>No</button>
                </Modal.Footer>
            </Modal>

        </>
    );
};