import { AuthContext } from "context";
import copy from "copy-to-clipboard";
import { useRequest } from "hooks";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import shareFbPost from "requests/shareFbPost";
import getLoyaltyPoints from "requests/getLoyaltyPoibts";
import clientSaveCoupon from "requests/clientSaveCoupon";
import { useForm } from "react-hook-form";

const toastOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
};

const ClientLoyaltyTable = ({ user }) => {
    const [couponObj, setCouponObj] = useState({
        points: 0
    });
    const [points, setPoints] = useState([]);
    const [rates, setRates] = useState([]);
    const [shareFbPostReq] = useRequest(shareFbPost);
    const [getLoyaltyPointsReq] = useRequest(getLoyaltyPoints);
    const [clientSaveCouponReq] = useRequest(clientSaveCoupon);
    const { register, setValue, trigger, control, handleSubmit, formState: { errors } } = useForm();

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        loadPoints();
        loadFbSdk();
    }, []);

    const handleConvertPoints = () => {
        clientSaveCouponReq(couponObj)
            .then(response => {
                if (response.data.error) {
                    toast.error(response.data.message, toastOptions);
                } else {
                    toast.success('Coupon has been generated. visit coupons page to see it.', toastOptions);
                }
            })
    };

    const loadPoints = () => {
        getLoyaltyPointsReq()
            .then(response => {
                console.log(response);
                setPoints(response.data.points);
                setRates(response.data.rates);
            });
    };

    const loadFbSdk = () => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page
                version: 'v2.5' // use version 2.1
            });
        };

        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

    const openFbShareDialog = () => {
        window.FB.ui(
            {
                method: 'feed',
                name: 'Georgian Cargo',
                link: `https://georgiancargo.co.uk`,
                picture: `georgiancargo.co.uk/logo2.png`,
                caption: 'Georgian Cargo',
                description: 'Global shipments to GEORGIA',
                title: 'Global shipments to GEORGIA',
            },
            function (response) {
                if (response) {
                    shareFbPostReq()
                        .then(response => {
                            if (response.data.inserted) {
                                toast.success("Success!", toastOptions);
                            }
                            else {
                                toast.error("You can get points for sharing only once in a month.", toastOptions);

                            }
                        });
                }
            }
        );
    };

    return (
        <>
            {points && points.length > 0 && (
                <div className="alert border shadow-sm bg-white">
                    <h4>Refferal Program</h4>
                    You have <div className="badge bg-primary">{user.points}</div> points. <br />
                    you can convert these points to coupons.<br />
                    To earn points, you have multiple options. <br />
                    <hr />
                    <b> 1. გააზიარე ჩვენი ვებსაიტი Facebook-ზე, როგორც საჯარო ან მეგობრებზე მორგებულ პოსტად და მოიპოვე <div className="badge bg-primary">{points.find(x => x.type === 'SHARE_LINK').value}</div> ქულა.
                        <br /></b>
                    <b> Share our website on facebook as public/friends post and get <div className="badge bg-primary">{points.find(x => x.type === 'SHARE_LINK').value}</div> points.
                        <br /></b>
                    <small className="text-muted" style={{ fontSize: "12px" }}><i className="bi bi-info-circle me-1"></i>You can get points only once in a month.</small>
                    <br />
                    <button type="button" onClick={() => openFbShareDialog()} className="btn btn-primary mt-1"><i class="bi bi-facebook"></i> Share on Facebook</button>
                    <hr />
                    <b>2. მოიწვიე შენი მეგობარი ჩვენს ვებგვერდზე რეგისტრაციისთვის ქვემოთ მოცემული ბმულით და მიიღებ <div className="badge bg-primary">{points.find(x => x.type === 'INVITE_CUSTOMER').value}</div> ქულას.
                        <br /></b>
                    <b>You can invite your friend to register on our website with the link below then you will get <div className="badge bg-primary">{points.find(x => x.type === 'INVITE_CUSTOMER').value}</div> points.
                        <br /></b>
                    <small className="text-muted" style={{ fontSize: "12px" }}><i className="bi bi-info-circle me-1"></i>At least one customer must use our service from your last 10 invited individuals.</small>
                    <br />
                    <small className="border p-2 mt-2 mb-2 d-inline-block">{`${window.location.origin}/home/register?invite=${auth.staff.loyalty_code}`} <i className="bi bi-subtract ms-1" role="button" onClick={() => (copy(`${window.location.origin}/home/register?invite=${auth.staff.loyalty_code}`), toast.success("Copied to clipboard!", toastOptions))}></i></small>
                    <hr />
                    <b>3. როდესაც თქვენი მოწვეული მომხმარებელი გამოიყენებს ჩვენს სერვისს, თქვენ მიიღებთ  <div className="badge bg-primary">{points.find(x => x.type === 'INVITED_CUSTOMER_USED_SERVICE').value}</div> ქულას.
                        <br /></b>
                    <b>When your invited customer uses our service, you will get <div className="badge bg-primary">{points.find(x => x.type === 'INVITED_CUSTOMER_USED_SERVICE').value}</div> points.
                        <br /></b>
                    <hr />
                    <b>4. ყოველ ჯერზე, როდესაც გამოიყენებთ ჩვენს სერვისს, მიიღებთ  ტრანსპორტირების  ღირებულების<div className="badge bg-primary">{rates.percentage}%</div>-ს.
                        <br /></b>
                    <b>Every time you use our service you will get <div className="badge bg-primary">{rates.percentage}%</div> of freight price in points.
                        <br /></b>

                </div>
            )}
            {user && (
                <div className="alert border shadow-sm bg-white">
                    <h4>Convert points to coupon</h4>
                    <small className="text-muted" style={{ fontSize: "12px" }}><i className="bi bi-info-circle me-1"></i>Minimum 10 points required</small>
                    <div className="input-group mb-3">
                        <input type="text" value={couponObj.points}
                            {...register("points", {
                                required: {
                                    value: true,
                                    message: "This field is required"
                                },
                                valueAsNumber: true,
                                validate: (value) => (value > 9.99) || "You do not have enough points",
                            })}
                            onChange={(e) => (setCouponObj({ ...couponObj, points: e.target.value }), setValue("points", e.target.value))} className="form-control" placeholder="Enter points" aria-label="Enter points" aria-describedby="button-addon2" />
                        <button className="btn btn-primary" type="button" id="button-addon2"
                            onClick={() => handleSubmit(handleConvertPoints)()}>Convert</button>

                    </div>
                    {errors.points && <p className="text-danger d-block w-full">{errors.points.message}</p>}

                </div>
            )}
        </>
    );
};

export default ClientLoyaltyTable;