import React, { Component } from "react";
// import logo from './logo.svg';

import logo from "./yorha-black.png";
import "./App.css";
import YoRHa from "./game/YoRHa";



class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Glory to Mankind</h1>
          {/*<h2></h2>*/}
        </header>
        <p className="App-intro">Hacking mini game </p>
        <YoRHa />
      </div>
    );
  }
}

export default App;
