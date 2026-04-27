import React, { useState, useEffect } from "react";
import { useRequest } from 'hooks';
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import BookStepButtons from "./BookStepButtons";
import ReceiverAddressModal from "./ReceiverAddressModal";
import getRoutes from "requests/getRoutes";
import countryListAllIsoData from 'utils/CountryList'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import BookAddressPopover from "./BookAddressPopover";
import ItemDetailsModal from "./ItemDetailsModal";
import invertColor from "utils/invertColor";
import BookItemDetailsPopover from "./BookItemDetailsPopover";
import DeliveryToAddressInfoPopover from "./DeliveryToAddressInfoPopover";
import InsuranceInfoPopover from "./InsuranceInfoPopover";
import { toast } from "react-toastify";

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

const Items = ({ colors, book, setBook, bookItemObj, proceedNextFieldSet, updateBook, proceedPrevFieldSet, addressReceivers, setReceiversStart, receiversStart, addressReceiversLoading, setReceiversCountryCode }) => {
  const { sourcecountry, destinationCountry } = useParams();
  const [showEditReceiverAddressModal, setShowEditReceiverAddressModal] = useState(false);
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [itemIsSaving, setItemIsSaving] = useState(false);
  const [getRoutesData] = useRequest(getRoutes);
  const [filteredCountryList, setFilteredCountryList] = useState([]);
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemObj, setItemObj] = useState(null);
  const [itemsError, setItemsError] = useState(false);

  const closeItemDetailsModal = () => {
    setShowItemDetailsModal(false);
  };

  const addItemToBookItems = () => {
    const items = book?.items.map((item, i) => {
      if (activeItemId === item.item.id) {
        return itemObj;
      }
      return item;
    })
    setBook({ ...book, items: items })
  };

  const saveItemAddress = () => {
    addItemToBookItems();
    closeEditReceiverAddressModal();
  };

  const saveItemDetails = () => {
    addItemToBookItems();
    closeItemDetailsModal();
  };

  useEffect(() => {
    getRoutesData()
      .then((response) => {
        // console.log(response);
        setFilteredCountryList(countryListAllIsoData.filter(obj => {
          return response.data?.routes.map(a => a.code).includes(obj.value)
        }));
        // setLoadingAddresses(false);
      });
  }, []);


  const { register, reset, handleSubmit, formState: { errors } } = useForm();

  const onTodoChange = (index, value) => {
    let first = index.split(".")[0];
    let second = index.split(".")[1];
    setItemObj(prevObj => ({
      ...prevObj,
      [first]: { ...prevObj[first], [second]: value }
    }));

    // setItemObj({ ...addresses, [index]: value });
  };
  const closeEditReceiverAddressModal = () => {
    setShowEditReceiverAddressModal(false);
  };

  const openEditReceiverAddressModal = () => {
    setShowEditReceiverAddressModal(true);
  };

  const enterItemReceiver = (id) => {
    if (book.items.find(x => x.item.id === id) !== undefined) {
      setItemObj(book.items.find(x => x.item.id === id));
    }
    else {
      console.log(1);
      const obj = JSON.parse(JSON.stringify(bookItemObj));
      obj.item.id = id;
      setItemObj(obj);
    }
    setActiveItemId(id);
    setShowEditReceiverAddressModal(true);

  };

  const enterItemDetails = (id) => {
    if (book.items.find(x => x.item.id === id) !== undefined) {
      setItemObj(book.items.find(x => x.item.id === id));
    }
    else {
      const obj = JSON.parse(JSON.stringify(bookItemObj));
      obj.item.id = id;
      setItemObj(obj);
    }
    setActiveItemId(id);
    setShowItemDetailsModal(true);

  };


  const setDelivery = (e, id) => {
    const items = book?.items.map((item, i) => {
      if (id === item.item.id) {
        return { ...item, to_be_delivered: !(item.to_be_delivered) };
      }
      return item;
    })
    setBook({ ...book, items: items });
  };

  const setInsurance = (e, id) => {
    const items = book?.items.map((item, i) => {
      if (id === item.item.id) {
        return { ...item, insurance: !(item.insurance) };
      }
      return item;
    })
    setBook({ ...book, items: items });
  };


  const addItem = () => {
    const obj = JSON.parse(JSON.stringify(bookItemObj));
    obj.item.id = book.items.length + 1;
    obj.address.country_code = destinationCountry;
    setBook({ ...book, items: [...book.items, obj] })
  };


  const deleteItem = (id) => {
    const items = book?.items.filter(function (el) {
      return el.item.id !== id;
    });

    const items2 = items.map((it, i) => {
      return { ...it, item: { ...it.item, id: i + 1 } };
    });

    setBook({ ...book, items: items2 });

  };

  const handleItems = () => {

    if (book.items.length === 0) {
      setItemsError(true);
      toast.error("Please fill all red sections in items.", toastOptions);
      return false;
    }
    let oops = book.items.find((item) =>
      item.item.weight === 0
      ||
      item.address.line_1 === ''
    );
    if (oops !== undefined) {
      let targetDivs = document.getElementsByClassName("checkItemNotSelected");

      for (var i = 0; i < targetDivs.length; ++i) {
        if (targetDivs[i].innerText === '<Enter>') {
          targetDivs[i].classList.add("btn-danger");
        }
        else {
          targetDivs[i].classList.remove("btn-danger");
        }
      }
      setItemsError(true);
      toast.error("Please fill all red sections in items.", toastOptions);

      return false;
    }
    setItemsError(false);
    proceedNextFieldSet();
  };

  return (
    <>
      <div className="col-10">
        <fieldset>
          <div className="card text-center">
            <div className="card-header text-white bg-primary text-start d-inline-block w-100 p-3">
              <h4 className="text-white d-block w-100">items details</h4>
              <small className="text-white float-start">
                Fill details for your {book.items.length} item{book.items.length === 1 ? '' : 's'}
              </small>
            </div>
            <div className="card-body text-center ps-2 pe-2">
              <div className="row">
                <div class="table-responsive">
                  <table class="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Item #</th>
                        <th scope="col">Receiver address</th>
                        <th scope="col">Item Details</th>
                        <th scope="col">Insurance &nbsp;
                          <OverlayTrigger
                            trigger={['click', 'hover']}
                            placement="auto"
                            overlay={<InsuranceInfoPopover route={book.source_country} />}
                          >
                            <i className="bi bi-info-circle"></i>
                          </OverlayTrigger>

                        </th>
                        <th scope="col">Delivery to address &nbsp;
                          <OverlayTrigger
                            trigger={['click', 'hover']}
                            placement="auto"
                            overlay={<DeliveryToAddressInfoPopover route={book.source_country} />}
                          >
                            <i className="bi bi-info-circle"></i>
                          </OverlayTrigger>
                        </th>
                        <th>
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {book.items.length > 0 && book.items.map((bk, i) => (
                        <tr key={i}>
                          <th>
                            <span>{bk.item.id}. <i style={{ color: '#' + colors[bk.item.id] }} className="bi bi-box-seam-fill"></i></span>

                          </th>
                          <td>
                            <OverlayTrigger
                              trigger={['click', 'hover']}
                              placement="auto"
                              overlay={<BookAddressPopover address={
                                book.items.find(item => (item.item?.id === (bk.item.id) && item.address.line_1 !== ''))?.address
                              } title={'sayHello'} body={"Sdfsdf"} />}
                            >
                              <button
                                style={book.items.find(item => (item.item?.id === (bk.item.id) && item.address.line_1 !== '')
                                ) ? { backgroundColor: ('#' + colors[bk.item.id]), color: invertColor(colors[bk.item.id], true) } : {}}
                                className={"checkItemNotSelected btn btn-sm p-2 mb-2 mb-md-0 " +
                                  (
                                    book.items.find(item => (item.item?.id === (bk.item.id) && item.address.line_1 !== '')
                                    ) ? '' : 'btn-secondary')
                                }
                                onClick={() => {
                                  if (book.items.find(item => item.item?.id === (bk.item.id) && item.address.line_1 === '')) {
                                    enterItemReceiver(bk.item.id);
                                  }
                                }}

                              >{
                                  book.items.find(item => (item.item?.id === (bk.item.id) && item.address.line_1 !== '')) ? 'Entered' : '<Enter>'}
                              </button>
                            </OverlayTrigger>
                          </td>
                          <td>
                            <OverlayTrigger
                              trigger={['click', 'hover']}
                              placement="auto"
                              overlay={<BookItemDetailsPopover item={
                                book.items.find(item => (item.item?.id === (bk.item.id) && item.item.weight !== 0))?.item
                              } title={'sayHello'} body={"Sdfsdf"} />}
                            >
                              <button type="button"
                                style={book.items.find(item => (item.item?.id === (bk.item.id) && item.item.weight !== 0)
                                ) ? { backgroundColor: ('#' + colors[bk.item.id]), color: invertColor(colors[bk.item.id], true) } : {}}
                                className={"checkItemNotSelected btn btn-sm p-2 mb-2 mb-md-0 " +
                                  (
                                    book.items.find(item => (item.item?.id === (bk.item.id) && item.item.weight !== 0)
                                    ) ? '' : 'btn-secondary')
                                }
                                // onClick={() => enterItemDetails(bk.item.id)}
                                onClick={() => {
                                  if (book.items.find(item => item.item?.id === (bk.item.id) && item.item.weight === 0)) {
                                    enterItemDetails(bk.item.id);
                                  }
                                }}
                              >
                                {
                                  book.items.find(item => (item.item?.id === (bk.item.id) && item.item.weight !== 0)) ? 'Entered' : '<Enter>'}

                              </button>
                            </OverlayTrigger>
                            {/* <button type="button" className="btn btn-sm p-2 ms-2 btn-secondary">Edit</button> */}
                          </td>
                          <td>
                            <input
                              // disabled={book?.items?.find(item => item.item?.id === (i + 1)) === undefined}
                              onChange={(e) => setInsurance(e, bk.item.id)}
                              style={{ zoom: "1.8" }}
                              checked={book?.items?.find(item => item?.item?.id === (bk.item.id))?.insurance}
                              type="checkbox" aria-label="Checkbox for following text input" />
                          </td>
                          <td>
                            <input
                              // disabled={book?.items?.find(item => item.item?.id === (i + 1)) === undefined}
                              onChange={(e) => setDelivery(e, bk.item.id)}
                              style={{ zoom: "1.8" }}
                              checked={book?.items?.find(item => item?.item?.id === (bk.item.id))?.to_be_delivered}
                              type="checkbox" aria-label="Checkbox for following text input" />
                          </td>
                          <td>
                            <button type="button" className="btn pl-2 pb-1 pr-2 pt-1 btn-outline-danger"
                              onClick={() => deleteItem(bk.item.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="text-start">

                        <td colSpan="6">
                          <button type="button" className="btn btn-secondary"
                            onClick={() => addItem()}>
                            <i className="bi bi-plus-lg"></i> &nbsp; Add item
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="span2 pb-4 text-end me-4 ms-4">
              {/* <button className="float-start btn btn-secondary btn-sm" onClick={proceedPrevFieldSet}><i className="bi bi-arrow-left-short" style={{ fontSize: "18px" }}
              ></i> Back</button> */}
              {/* <button className="btn btn-success btn-sm" onClick={() => handleItems()}>Next <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
              ></i></button> */}
            </div>
          </div>
        </fieldset>
      </div>
      <div className="col-1 ps-0 ms-n3 ms-lg-0 me-lg-n6" style={{ marginTop: "150px" }}>
        <button className="btn btn-success btn-sm" onClick={() => handleItems()}><span className="d-none d-sm-none d-md-block d-lg-block">Next</span> <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}
        ></i></button>
      </div>
      <ReceiverAddressModal
        book={book}
        activeItemId={activeItemId}
        itemObj={itemObj}
        setItemObj={setItemObj}
        closeEditReceiverAddressModal={closeEditReceiverAddressModal}
        openEditReceiverAddressModal={openEditReceiverAddressModal}
        onTodoChange={onTodoChange}
        itemIsSaving={itemIsSaving}
        showEditReceiverAddressModal={showEditReceiverAddressModal}
        filteredCountryList={filteredCountryList}
        addressReceivers={addressReceivers}
        setReceiversStart={setReceiversStart}
        receiversStart={receiversStart}
        addressReceiversLoading={addressReceiversLoading}
        saveItemAddress={saveItemAddress}
        setReceiversCountryCode={setReceiversCountryCode}
        destinationCountry={destinationCountry}
      />
      <ItemDetailsModal
        saveItemDetails={saveItemDetails}
        book={book}
        onTodoChange={onTodoChange}
        activeItemId={activeItemId}
        itemObj={itemObj}
        setItemObj={setItemObj}
        closeItemDetailsModal={closeItemDetailsModal}
        showItemDetailsModal={showItemDetailsModal}
      />
    </>
  );
};

export default Items;