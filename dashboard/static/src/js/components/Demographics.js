import React, {Component} from "react";
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';
import Error from './Error';
import {sendRequest, dateFormat} from './Utility';

const NO_TEXT = "not provided";
export default class Demographics extends Component {
    constructor () {
        super(...arguments);
        this.state = {
            coreInfo: {},
            errorMessage: ""
        };
    }
    componentDidMount() {
        sendRequest("./Patient/"+this.props.info.id).then(response => {
          let rawData = {};
          if (response) {
            try {
                rawData = JSON.parse(response);
            } catch(e) {
                console.log("Error parsing questionnaire json: ", e);
                rawData = null;
            }
          }
          if (!rawData) {
              return false;
          }
          let dataSet = {};
          dataSet["Birth_date"] = rawData.birthDate ? dateFormat(rawData.birthDate) : "";
          dataSet["Gender"] = rawData.gender;
          dataSet.phone = "";
          if (rawData.telecom) {
              const teleResult = (rawData.telecom).filter(item => item.system == "phone");
              if (teleResult.length) {
                dataSet.phone = teleResult[0].value;
              }
          }
          dataSet["Primary_zipcode"] = "";
          if (rawData.address) {
              const homeAddress = (rawData.address).filter(item => item.use == "home");
              if (homeAddress.length) {
                dataSet["Primary_zipcode"] = homeAddress[0].postalCode;
              }
              const secondaryAddress = (rawData.address).filter(item => !item.use);
              if (secondaryAddress.length) {
                dataSet["Secondary_zipcode"] = secondaryAddress[0].postalCode;
              }
          }
          this.setState({coreInfo: dataSet, errorMessage: ""});
        }, error => {
          let errorMessage = error.statusText ? error.statusText: error;
          console.log("Failed ", errorMessage);
          this.setState({errorMessage: `Error retrieving demographics data: ${errorMessage}`});
        });
      }
    renderProfileLabel(label) {
        return (<InputLabel required={false} shrink={true} className="profile-label">{label.replace(/\_/g, " ")}</InputLabel>);
    }
    renderProfileText(text) {
        return (<span>{text && String(text).trim() ? text: NO_TEXT}</span>);
    }
    render() {
        const {info} = this.props;
        return (
            <div className="demographics-container">
                {this.renderProfileLabel("Name")}
                {this.renderProfileText(info.name)}
                <Divider/>
                {this.renderProfileLabel("Email")}
                {this.renderProfileText(info.email)}
                <Divider />
                {

                    Object.entries(this.state.coreInfo).map((item, index) => {
                        let itemContent = this.state.coreInfo[item[0]];
                        return (   
                            <section key={index}>
                                {this.renderProfileLabel(item[0])}
                                {this.renderProfileText(itemContent)}
                                <Divider></Divider>
                            </section>
                        )
                    })
                }
                <Error message={this.state.errorMessage} className={`error-message ${this.state.errorMessage?'show':'hide'}`}></Error>
            </div>
        );
    }
}
