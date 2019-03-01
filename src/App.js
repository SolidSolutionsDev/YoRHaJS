import React, { Component } from "react";

import logo from "./yorha-black.png";
import "./App.css";

import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./stores";
import {Game} from "./renderer/Game";

const store = createStore(
    rootReducer /* preloadedState, */,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

class App extends Component {
  render() {
    return (
      <div className="App" key={"app"}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Glory to Mankind</h1>
        </header>
        <p className="App-intro">Hacking mini game </p>
          <Provider store={store} key={"provider"}>
            <Game key={"game"}/>
          </Provider>
      </div>
    );
  }
}

export default App;
