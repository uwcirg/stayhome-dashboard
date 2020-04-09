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
          dataSet["birth_date"] = rawData.birthDate ? dateFormat(rawData.birthDate) : "";
          dataSet["gender"] = rawData.gender;
          dataSet.phone = "";
          if (rawData.telecom) {
              const teleResult = (rawData.telecom).filter(item => item.system == "phone");
              if (teleResult.length) {
                dataSet.phone = teleResult[0].value;
              }
          }
          dataSet["primary_zipcode"] = "";
          if (rawData.address) {
              const homeAddress = (rawData.address).filter(item => item.use == "home");
              if (homeAddress.length) {
                dataSet["primary_zipcode"] = homeAddress[0].postalCode;
              }
              const secondaryAddress = (rawData.address).filter(item => !item.use);
              if (secondaryAddress.length) {
                dataSet["secondary_zipcode"] = secondaryAddress[0].postalCode;
              }
          }
          this.setState({coreInfo: dataSet, errorMessage: ""});
        }, error => {
          let errorMessage = error.statusText ? error.statusText: error;
          console.log("Failed ", errorMessage);
          this.setState({errorMessage: `Error retrieving demographics data: ${errorMessage}`});
        });
      }
    render() {
        const {info} = this.props;
        return (
            <div className="demographics-container">
                <InputLabel required={false} shrink={true} className="profile-label">Name</InputLabel><span>{info.name && String(info.name).trim() ? info.name: NO_TEXT}</span>
                <Divider/>
                <InputLabel required={false} shrink={true} className="profile-label">Email</InputLabel><span>{info.email || NO_TEXT}</span>
                <Divider></Divider>
                {

                    Object.entries(this.state.coreInfo).map((item, index) => {
                        let itemContent = this.state.coreInfo[item[0]];
                        return (   
                            <section key={index}>
                                <InputLabel required={false} shrink={true} className="profile-label">{item[0].replace(/\_/g, " ")}</InputLabel>
                                <div>{itemContent && String(itemContent).trim()? itemContent : NO_TEXT}</div>
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
