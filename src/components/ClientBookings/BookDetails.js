import { Modal } from "react-bootstrap";
import { flagEmoji } from "../../utils/FlagEmoji";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

const BookDetails = ({ activeBookingDetails, closeBookingDetailsModal, showBookingDetailsModal }) => {

  const getPDF = () => {
    var w = document.getElementById("activebookingdetailsid").offsetWidth;
    var h = document.getElementById("activebookingdetailsid").offsetHeight;
    let quotes = document.getElementById('activebookingdetailsid');
    html2canvas(quotes, {
      quality: 4,
    }).then((canvas) => {
      var imgData = canvas.toDataURL('image/png');

      /*
      Here are the numbers (paper width and height) that I found to work. 
      It still creates a little overlap part between the pages, but good enough for me.
      if you can find an official number from jsPDF, use them.
      */
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF('p', 'mm');
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save("Booking-" + activeBookingDetails.id + ".pdf");
    });
  };

  console.log(activeBookingDetails);

  return (
    <Modal
      size="xl"
      onHide={closeBookingDetailsModal}
      show={showBookingDetailsModal}
      aria-labelledby="create-route-title"
      centered
    >
      <Modal.Header style={{ backgroundColor: "#f5f4f4" }} closeButton>
        <Modal.Title id="create-route-title">Booking details</Modal.Title>
        {/* <button className="btn btn-secondary btn-sm ms-2" onClick={() => { getPDF() }}>
          PDF
        </button> */}
      </Modal.Header>

      <Modal.Body
        style={{ backgroundColor: "#f5f4f4" }}
        id="activebookingdetailsid">
        <>
          <div className="d-block w-100 text-center">
            Book info
          </div>
          {activeBookingDetails.courier_note !== null && activeBookingDetails.courier_note?.toString().length > 0 && (

            <div className="mt-1 alert alert-info d-flex align-items-center" role="alert">
              <i className="text-white me-2 bi bi-info-circle-fill"></i>
              <div>
                Note from Courier: {activeBookingDetails.courier_note}
              </div>
            </div>
          )}
          <div class="table-responsive bg-white">
            <table className="table table-bordered table-striped">
              <tr className="table-secondary">
                <th>Collection address</th>
                <th>courier visit date</th>
                <th>Drop Off</th>
                <th>Home collection</th>
                <th>Courier phone</th>
                <th>status</th>
              </tr>
              <tr>
                <td>
                  {activeBookingDetails.ci_address_country_code} &nbsp; {flagEmoji(activeBookingDetails.ci_address_country_code)}
                  <br />
                  {activeBookingDetails.ci_address_line_1}
                  <br />
                  {activeBookingDetails.ci_address_line_2}
                  <br />
                  {activeBookingDetails.ci_address_postal_code}
                </td>
                <td>
                  {
                    moment(activeBookingDetails.courier_visit_date).format(
                      "D MMMM, YYYY"
                    )}
                </td>
                <td>
                  {activeBookingDetails.drop_off === 1 && (
                    <i className="bi bi-check-lg text-success" style={{ fontSize: "20px" }}></i>
                  )}
                  {activeBookingDetails.drop_off === 0 && (
                    <i className="bi bi-x text-danger" style={{ fontSize: "20px" }}></i>
                  )}
                </td>
                <td>
                  {activeBookingDetails.home_collection === 1 && (
                    <i className="bi bi-check-lg text-success" style={{ fontSize: "20px" }}></i>
                  )}
                  {activeBookingDetails.home_collection === 0 && (
                    <i className="bi bi-x text-danger" style={{ fontSize: "20px" }}></i>
                  )}
                </td>
                <td>{activeBookingDetails.courier_phone}</td>
                <td>
                  {
                    activeBookingDetails.finished === 1 && activeBookingDetails.courier_phone !== null && (
                      <span className="text-success">Finished</span>
                    )
                  }
                  {
                    activeBookingDetails.finished === 1 && activeBookingDetails.courier_phone === null && (
                      <span className="text-danger">Canceled</span>
                    )
                  }
                  {
                    activeBookingDetails.finished === 0 && activeBookingDetails.courier_phone !== null && (
                      <span className="text-info">Handled</span>
                    )
                  }
                  {
                    activeBookingDetails.finished === 0 && activeBookingDetails.courier_phone === null && (
                      <span className="text-dark">Pending</span>
                    )
                  }
                </td>
              </tr>
            </table>
          </div>
          <div className="d-block w-100 text-center">
            {activeBookingDetails.items.length} Item{activeBookingDetails.items.length !== 1 ? 's' : ''}
          </div>
          <div class="table-responsive bg-white">
            <table className="table table-bordered table-striped">
              <tr className="table-secondary">
                <th>#</th>
                <th>Weight</th>
                <th>Dimensions</th>
                <th>Value</th>
                <th>Content</th>
                <th>Delivery to address</th>
                <th>Insurance</th>
                <th>Processing status</th>
                <th>Receiver address</th>
              </tr>
              {activeBookingDetails.items.length > 0 && activeBookingDetails.items.map((item, i) => (
                <tr>
                  <td style={{ padding: "5px" }}>{item.item_id}</td>
                  <td style={{ padding: "5px" }}>{item.weight} kg</td>
                  <td style={{ padding: "5px" }}>{item.dimensions}</td>
                  <td style={{ padding: "5px" }}>{item.value}</td>
                  <td style={{ padding: "5px" }}>{item.details}</td>
                  <td style={{ padding: "5px" }}>
                    {item.to_be_delivered === 1 && (
                      <i className="bi bi-check-lg text-success" style={{ fontSize: "20px" }}></i>
                    )}
                    {item.to_be_delivered === 0 && (
                      <i className="bi bi-x text-danger" style={{ fontSize: "20px" }}></i>
                    )}
                  </td>
                  <td style={{ padding: "5px" }}>
                    {item.insurance === 1 && (
                      <i className="bi bi-check-lg text-success" style={{ fontSize: "20px" }}></i>
                    )}
                    {item.insurance === 0 && (
                      <i className="bi bi-x text-danger" style={{ fontSize: "20px" }}></i>
                    )}
                  </td>
                  <td style={{ padding: "5px" }}>
                    {item.finished === 1 && (
                      <i className="bi bi-check-lg text-success" style={{ fontSize: "20px" }}></i>
                    )}
                    {item.finished === 0 && (
                      <i className="bi bi-x text-danger" style={{ fontSize: "20px" }}></i>
                    )}
                  </td>
                  <td style={{ padding: "5px" }}>
                    {item.receiver_address.country_code} &nbsp; {flagEmoji(item.receiver_address.country_code)}
                    <br />
                    {item.receiver_address.name}
                    <br />
                    {item.receiver_address.phone}
                    <br />
                    {item.receiver_address.email}
                    <br />
                    {item.receiver_address.line_1}
                    <br />
                    {item.receiver_address.line_2}
                    <br />
                    {item.receiver_address.postal_code}
                  </td>
                </tr>
              ))}
            </table>
          </div>


        </>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#f5f4f4" }}>
        <button className="btn btn-sm btn-white " onClick={closeBookingDetailsModal}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookDetails;
