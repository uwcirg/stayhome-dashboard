import React, { Component } from "react";
import Header from "./components/Header";
import Table from "./components/Table";
import Footer from "./components/Footer";
import "../less/index.less";

export default class App extends React.Component {
  render () {
    return (
      <div className="landing">
          <Header />
          <Table />
          <Footer /> 
      </div>
    );
  }
}
