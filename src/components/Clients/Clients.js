// import "./clients.css";
import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row, Table } from "react-bootstrap";
import useRequest from "../../hooks/useRequest";
import clientsRequest from "requests/clients";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { currency_symbols } from "../../utils/Currency";
import { makeid } from "../../utils/RandomString";
import { AuthContext } from "../../context"
import { useParams, useHistory } from 'react-router-dom';
import moment from "moment";
const initFilter = { route: "", datefrom: "", dateto: "" };
const { SearchBar } = Search;



function Client() {
  const [loading, setLoading] = useState(true);
  const [getClients] = useRequest(clientsRequest);
  const [filter, setFilter] = useState(initFilter);
  const [clientsData, setClientsData] = useState([]);
  const [size, setSize] = useState(0);
  const { auth } = useContext(AuthContext);
  let history = useHistory();
  let access_token = auth.accessToken;
  const columns = [
    {
      text: 'Id',
      dataField: 0,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return rowIndex + 1;
      },
    },
    {
      text: 'Registered',
      dataField: 1,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return row[0] === null ? <i class="text-danger bi bi-x-square-fill"></i> : <i class="text-success bi bi-check-square-fill"></i>
      },
    },
    {
      text: 'Name',
      dataField: 1,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return <a className="text-danger" role="button" onClick={() => history.push("/manage/client/" + btoa(row[1]))}> {cell} </a>
      }
    },
    {
      text: 'Email',
      dataField: 2,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return  <a className="text-danger" role="button" onClick={() => history.push("/manage/client/" + btoa(row[1]))}> {cell} </a>
      }
    },
    {
      text: 'Username',
      dataField: 3,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return cell === null ? '---' : cell;
      }
    },
    {
      text: 'Last active',
      dataField: 14,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return moment(cell).fromNow();
      }
    },
    {
      text: 'Currency',
      dataField: 4,
      sort: true,
    },
    {
      text: 'Freight',
      dataField: 5,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return currency_symbols(row[4]) + cell.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }

    },
    {
      text: 'Packaging',
      dataField: 6,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return currency_symbols(row[4]) + cell.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    {
      text: 'Delivery',
      dataField: 7,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return currency_symbols(row[4]) + cell.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    {
      text: 'Extra',
      dataField: 8,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return currency_symbols(row[4]) + cell.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    {
      text: 'Discount',
      dataField: 9,
      sort: true,
      formatter: (cell, row, rowIndex, colIndex) => {
        return currency_symbols(row[4]) + cell.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    {
      text: 'Paid',
      dataField: 10,
      sort: true,
      style: {
        color: "#5B9317"
      },
      formatter: (cell, row, rowIndex, colIndex) => {
        return currency_symbols(row[4]) + cell.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    {
      text: 'Unpaid',
      dataField: 11,
      sort: true,
      style: {
        color: "#ed1c24"
      },
      formatter: (cell, row, rowIndex, colIndex) => {
        return currency_symbols(row[4]) +
          cell.toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    {
      text: 'Weight',
      dataField: 12,
      sort: true,
    },
    {
      text: 'Parcels count',
      dataField: 13,
      sort: true,
    },
    {
      text: 'Points',
      dataField: 15,
      sort: true,
    },
  ];


  useEffect(() => {
    setSize(0);
    getClientsHandler();
  }, []);

  const getClientsHandler = () => {
    setLoading(true);
    setClientsData([]);
    getClients({ ...filter })
      .then((response) => {
        setClientsData(response.data.customers.map((tag) => Object.values(tag)));
        setSize(response.data.customers.length);
        setLoading(false);
      })
      .catch((e) => console.error(e, 999));
  };




  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange
  }) => (

    <div className="btn-group float-start" role="group">
      {
        [{ text: "10", page: 10 },
        { text: "30", page: 30 },
        { text: "50", page: 50 },
        { text: "100", page: 100 }].map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? 'btn-dark' : 'btn-secondary'}`}
            >
              {option.text}
            </button>
          );
        })
      }
    </div>

  );
  const options = {
    custom: true,
    totalSize: size,
    sizePerPageRenderer

  };
  const MyExportCSV = props => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <button className="mb-2 float-end btn btn-info" onClick={handleClick}>
          Export CSV ({size})
        </button>
      </div>
    );
  };

  const updateFilter = ({ key, value }) => {
    if (value) {
      setFilter((prev) => ({ ...prev, [key]: value }));
    } else {
      setFilter((prev) => {
        const { [key]: _, ...newFilter } = prev;
        return newFilter;
      });
    }
  }

  const handleFilter = () => {
    setFilter(filter);
    getClientsHandler();
  };
  const resetFilter = () => {
    setFilter(initFilter);
    getClientsHandler();

  };

  const asearch = (newres) => {
    var res = newres.length;
    setSize(res)
  };

  require("./clients.css");
  return (
    <>
      <Row className={"mb-2 mt-4 border-bottom pb-2"}>
        <Col xs={6} md={4} lg={2}>
          <label htmlFor="dateFrom">Date from:</label>
          <input type={"date"} id="datefrom" className={"form-control"} value={filter.datefrom} onChange={({ target: { value } }) => { updateFilter({ key: 'datefrom', value }) }} />
        </Col>
        <Col xs={6} md={4} lg={2}>
          <label htmlFor="dateTo">Date to:</label>
          <input type={"date"} id="dateto" className={"form-control"} value={filter.dateto} onChange={({ target: { value } }) => { updateFilter({ key: 'dateto', value }) }} />
        </Col>
        <Col xs={6} md={4} lg={2}>
          <label htmlFor="route">Route:</label>
          <select className={"form-control"} id="route"
            value={filter.route}
            onChange={({ target: { value } }) => { updateFilter({ key: 'route', value: value }) }}>
            <option value="">All</option>
            <option value="GE/IE">GE/IE</option>
            <option value="GE/SE">GE/SE</option>
            <option value="GE/UK">GE/UK</option>
            <option value="IE/GE">IE/GE</option>
            <option value="SE/GE">SE/GE</option>
            <option value="UK/GE">UK/GE</option>
          </select>
        </Col>

        <Col xs={4} className="">
          <label>&nbsp;</label>
          <ButtonGroup className={"d-flex"}>
            <Button variant={"primary"} block onClick={handleFilter}>Filter</Button>
            {(JSON.stringify(initFilter) !== JSON.stringify(filter)) &&
              <Button variant={"danger"} onClick={resetFilter}>&times;</Button>
            }
          </ButtonGroup>
        </Col>
      </Row>
      {loading && (
        <>
          <style>{`
        .spinner-border {
          width: 4rem; height: 4rem;
        }
          `}
          </style>
          <center>
            <div className="m-4 spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </center>
        </>
      )}


      {!loading && (
        <>
          <PaginationProvider
            pagination={paginationFactory(options)}
          >
            {
              ({
                paginationProps,
                paginationTableProps,
              }) => (
                <div className="m-4">

                  <SizePerPageDropdownStandalone
                    {...paginationProps}
                  />
                  <PaginationListStandalone
                    {...paginationProps}
                  />
                  <ToolkitProvider
                    keyField="id"
                    columns={columns}
                    data={clientsData}
                    search={
                      {
                        afterSearch: (newResult) => asearch(newResult)
                      }
                    }
                    exportCSV={{
                      fileName: "Clients_" + makeid(6) + ".csv",
                      onlyExportFiltered: true,
                      exportAll: false
                    }}
                  >
                    {toolkitprops => (
                      <>
                        <MyExportCSV {...toolkitprops.csvProps} />
                        <SearchBar className="ms-5 border border-dark" {...toolkitprops.searchProps} />
                        {/* {console.log(clientsData.length)} */}
                        <BootstrapTable
                          {...toolkitprops.baseProps}
                          {...paginationTableProps}
                          // selectRow={selectRow}
                          // defaultSorted={defaultSorted}
                          defaultSortDirection="asc"
                          hover
                          condensed
                          noDataIndication="No Data Is Available"
                        />
                      </>
                    )}
                  </ToolkitProvider>

                </div>

              )
            }
          </PaginationProvider>



          {/* <BootstrapTable 
     keyField='id' 
     className={"table table-striped table-bordered sortable-theme-light"}
     data={ clientsData } 
     columns={ columns }
     pagination={ paginationFactory()} 
     search={ {
      searchFormatted: true
    } }
    /> */}
        </>
      )}
    </>
  );
}

export default Client;