import { useRequest } from "hooks";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import addCoupons from "requests/addCoupons";
import { toast } from "react-toastify";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const NewCouponsModal = ({ show, setShow, setCoupons, coupons, limit }) => {
    const { register, setValue, reset, handleSubmit, trigger, formState: { errors } } = useForm({ mode: 'onChange' });
    const [newCoupon, setNewCoupon] = useState({
        count: 1,
        amount: 1.00,
        expires_in: 30,
        prefix: ''
    });
    const [sending, setSending] = useState(false);
    const [addCouponsReq] = useRequest(addCoupons);

    const onTodoChange = (key, val) => {
        setNewCoupon({ ...newCoupon, [key]: val });
    };

    const saveCoupons = () => {
        setSending(true);
        addCouponsReq(newCoupon)
            .then((response) => {
                let cpns = [...coupons];
                let newCpns = response.data.coupons.slice(0, Math.abs(limit - cpns.length === 0 ? limit : limit - cpns.length));
                if (limit < cpns.length + newCpns.length) {
                    cpns.length = Math.abs(cpns.length - newCpns.length);
                }
                // console.log(newCpns, cpns); return;
                setCoupons(newCpns.concat(cpns));
                toast.success(`${newCpns.length} coupons have generated.`, toastOptions);
                setShow(false);
            });
        setSending(false);
    };

    return (
        <Modal
            size="lg"
            onHide={() => setShow(false)}
            show={show}
            fullscreen={true}
            aria-labelledby="create-route-title"
            backdrop="static"
            centered
        >
            {/* <Modal.Header  /> */}
            <Modal.Header closeButton>
                <h3>Generate Coupons</h3>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <>
                    <div className="form-floating mb-2">
                        <input
                            value={newCoupon.count}
                            onChange={(e) => onTodoChange('count', e.target.value)}
                            type="number" name="count" className="form-control position-relative" id="floatingInput" placeholder=" " />
                        <label for="floatingInput">Count</label>
                        {errors.count && <p className="text-danger d-block w-full">{errors.count.message}</p>}
                    </div>

                    <div className="form-floating mb-2">
                        <input
                            value={newCoupon.amount}
                            onChange={(e) => onTodoChange('amount', e.target.value)}
                            type="number" name="count" className="form-control position-relative" id="floatingInput" placeholder=" " />
                        <label for="floatingInput">Discount Amount</label>
                        {errors.amount && <p className="text-danger d-block w-full">{errors.amount.message}</p>}
                    </div>

                    <div className="form-floating mb-2">
                        <input
                            value={newCoupon.prefix}
                            onChange={(e) => onTodoChange('prefix', e.target.value)}
                            type="text" name="prefix" className="form-control position-relative" id="floatingInput" placeholder=" " />
                        <label for="floatingInput">Coupon Code Prefix (optional)</label>
                        {errors.prefix && <p className="text-danger d-block w-full">{errors.prefix.message}</p>}
                    </div>
                    <div className="form-floating mb-2">
                        <input
                            value={newCoupon.expires_in}
                            onChange={(e) => onTodoChange('expires_in', e.target.value)}
                            type="number" name="prefix" className="form-control position-relative" id="floatingInput" placeholder=" " />
                        <label for="floatingInput">Expires in: (number of days)</label>
                        {errors.expires_in && <p className="text-danger d-block w-full">{errors.expires_in.message}</p>}
                    </div>
                    <button
                        disabled={sending}
                        className="btn btn-primary float-end" onClick={() => saveCoupons()} >
                        {sending ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            "Save"
                        )}
                    </button>
                </>
            </Modal.Body>
        </Modal>
    );
};

export default NewCouponsModal;