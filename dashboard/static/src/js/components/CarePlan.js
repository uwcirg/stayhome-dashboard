import React, {Component} from "react";
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import Error from './Error';
import Questionnaire from './Questionnaire';
import {sendRequest, dateFormat} from './Utility';

export default class CarePlan extends Component {
    constructor () {
        super(...arguments);
        this.state = {
            coreInfo: [],
            loading: true,
            errorMessage: ""
        };
    }
    componentDidMount() {
        sendRequest("./CarePlan?subject=Patient/"+this.props.userId).then(response => {
          let rawData = {};
          if (response) {
            try {
              rawData = JSON.parse(response);
            } catch(e) {
              console.log("error parsing response! ", e);
              rawData = null;
            }
            
          }
          if (!rawData || !rawData.entry || !rawData.entry.length) {
            this.setState({loading: false});
            return false;
          }
          let dataSet = [];
          rawData.entry.forEach(function(item) {
            if (!item.resource || item.resource.status !== "active") {
              return true;
            }
            let resource = item.resource;
            dataSet.push({
              id: resource.id,
              lastUpdated: dateFormat(resource.meta.lastUpdated),
              period: {
                start: resource.period && resource.period.start ? dateFormat(resource.period.start) : "",
                end: resource.period && resource.period.end ? dateFormat(resource.period.end) : "",
              },
              description: `Care plan: ${resource.description}`
            })
          });
          this.setState({coreInfo: dataSet, loading: false, errorMessage: ""});
        }, error => {
          let errorMessage = error.statusText ? error.statusText: error;
          console.log("Failed ", errorMessage);
          this.setState({loading: false, errorMessage: errorMessage});
        });
      }
    render() {
        let items =  (this.state.coreInfo).map((item, key) => {
          return (
            <section key={key}>
              <div className="title">{item.description}</div>
              <Divider/>
              <div className="detail">
                <InputLabel required={false} shrink={true} className="profile-label">Period</InputLabel>
                <div>{item.period.start + ' - ' + item.period.end}</div>
                <InputLabel required={false} shrink={true} className="profile-label">Last updated</InputLabel>
                <div>{item.lastUpdated}</div>
              </div>
              <Questionnaire carePlanId={item.id} />
            </section>
          )
        });
        return (
            <div className="questionnaire-container">
              <Error message={this.state.errorMessage} className={`error-message ${this.state.errorMessage?'show':'hide'}`}></Error>
              <div className={this.state.loading?"loading":"hide"}>
                <div className="loader"></div>
              </div>
              <div className={this.state.loading?"hide":"show"}>
                {
                  items
                }
                {!this.state.loading && !items.length && !this.state.errorMessage && <div>No data available</div>}
              </div>
            </div>
        );
    }
}
