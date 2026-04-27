import React from "react";

const Table = (props) => {
    const {headers = [], centerLastChild} = {...props};
    return (
        <>
            <div
                className="table-responsive"
                style={{borderRadius: "4px", background: "#00000000"}}
            >
                <table
                    className="table table-thead-bordered table-nowrap table-align-middle"
                    style={{
                        border: "1px solid #e7eaf3",
                        margin: "0px",
                        background: "#fff",
                    }}
                >
                    <thead className="thead-light">
                        <tr>
                            {centerLastChild
                                ? headers.map((header, i) =>
                                      i === headers.length - 1 ? (
                                          <th key={i} className="text-center">
                                              {header}
                                          </th>
                                      ) : (
                                          <th key={i}>{header}</th>
                                      )
                                  )
                                : headers.map((header, i) => <th key={i}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>{props.children}</tbody>
                </table>
            </div>
        </>
    );
};
export default Table;
