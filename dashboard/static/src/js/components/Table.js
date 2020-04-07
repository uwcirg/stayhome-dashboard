import React from "react";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import {sendRequest, dateFormat} from './Utility';

export default class Table extends React.Component {
   constructor() {
      super();
      this.state = {
        data: [],
        loading: true,
        pages: 0,
        total: 0,
        hasError: false,
        errorMessage: ""
      };
  }
  componentDidMount() {
    sendRequest("./Patient").then(response => {
      let rawData = {};
      if (response) {
        rawData = JSON.parse(response);
      }
      let dataSet = [];
      if (rawData["entry"]) {   
        (rawData["entry"]).forEach(function(item) {
            var nameNode = item.resource && item.resource.name ? item.resource.name[0] : null;
            var firstName = nameNode && nameNode.given ? nameNode.given: "";
            var lastName = nameNode && nameNode.family ? nameNode.family: "";
            var fullName = [firstName, lastName].join(" ");
            var telecomeNode = item.resource && item.resource.telecom? item.resource.telecom : null;
            var email = "";
            var lastUpdated = item.resource && item.resource.meta && item.resource.meta["lastUpdated"] ? dateFormat(item.resource.meta["lastUpdated"]) : "--";
            if (telecomeNode) {
                telecomeNode.forEach(function(item) {
                    if (!email && item.system == "email") {
                        email = item.value;
                    }
                });
            }
            dataSet.push({
                id: item.resource.id,
                name: fullName,
                email: email,
                lastUpdated: lastUpdated
            });
        });
      }
      this.setState({ data: dataSet, total: dataSet.length, loading: false, hasError: false, errorMessage: "" });
    }, error => {
      console.error("Failed! ", error);
      this.setState({loading: false, hasError: true, errorMessage: `Failed to retrieve data: ${error}. Make sure that you have obtained the necessary roles needed for dashboard access.`});
    });
  }
  render() {
      let loadingClass = this.state.loading?'loading':'';
      const cellClass = "mdc-data-table__cell";
      return (
              <div className="accountsList">
                <h2>Accounts List <span className="count">({this.state.total + ' entries'})</span></h2>
                <div className={`tableWrapper ${loadingClass}`}>
                  <div className={`loading ${loadingClass?'':'hide'}`}>
                    <div className="loader"></div>
                  </div>
                  <div className={`error-message ${this.state.hasError?'show':'hide'}`}>{this.state.errorMessage}</div>
                  <ReactTable
                      data={this.state.data}
                      columns={[
                            {
                              Header: "ID",
                              accessor: "id",
                              sortable: true,
                              className: `${cellClass}`,
                              maxWidth: 72,
                              sortMethod: (a, b) => {
                                if (a == b) {
                                  return 0;
                                }
                                return parseInt(a) > parseInt(b) ? 1 : -1;
                              }
                            },
                            {
                              Header: "Username",
                              accessor: "email",
                              sortable: true,
                              className: `${cellClass}`
                            },
                            {
                              Header: "Name",
                              accessor: "name",
                              sortable: true,
                              className: `${cellClass}`
                            },
                            {
                              Header: "Last Updated",
                              accessor: "lastUpdated",
                              sortable: true,
                              className: `${cellClass}`
                            }
                          ]}
                          showPagination={true}
                          showPaginationTop={false}
                          showPaginationBottom={true}
                          showPageSizeOptions={true}
                          showPaginationBottom={true}
                          pageSizeOptions={[10, 20, 25, 50, 100]}
                          defaultPageSize={10}
                          sortable={true}
                          resizeable={true}
                          style={{
                            height: "67.5vh" // This will force the table body to overflow and scroll, since there is not enough room
                          }}
                          className="mdc-data-table__table -striped -highlight"
                          getTheadThProps={(state,rowInfo,column,instance) => {
                            return {
                                tabIndex: 0,
                                onKeyPress: (e, handleOriginal) => {
                                    if(e.which === 13) {
                                        instance.sortColumn(column);
                                        e.stopPropagation();
                                    }
                                }
                            };
                        }}
                  />
                </div>
            </div>
      );
  }
}
