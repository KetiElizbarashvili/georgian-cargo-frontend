import React, {Children} from "react";

const Modal = ({id, header, children}) => {
    const len = Children.toArray(children).length;
    return (
        <>
            {len === 2 ? children[0] : <></>}
            <div
                id={id}
                className="modal fade"
                tabIndex="-1"
                role="dialog"
                aria-labelledby={id + id}
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={id + id}>
                                {header}
                            </h5>
                            <button
                                type="button"
                                className="btn btn-xs btn-icon btn-soft-secondary"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <svg
                                    aria-hidden="true"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 18 18"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M11.5,9.5l5-5c0.2-0.2,0.2-0.6-0.1-0.9l-1-1c-0.3-0.3-0.7-0.3-0.9-0.1l-5,5l-5-5C4.3,2.3,3.9,2.4,3.6,2.6l-1,1 C2.4,3.9,2.3,4.3,2.5,4.5l5,5l-5,5c-0.2,0.2-0.2,0.6,0.1,0.9l1,1c0.3,0.3,0.7,0.3,0.9,0.1l5-5l5,5c0.2,0.2,0.6,0.2,0.9-0.1l1-1 c0.3-0.3,0.3-0.7,0.1-0.9L11.5,9.5z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            {len === 2 ? children[1] : children}
                        </div>
                        {/* <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-white"
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">
                                Save changes
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Modal;
