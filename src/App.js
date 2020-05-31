import React, { Component } from "react";

import logo from "./yorha-black.png";
import "./App.css";

import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./stores";
import {Game} from "./renderer/Game";
import Preloader from "./renderer/Preloader/Preloader";


const store = createStore(
    rootReducer /* preloadedState, */,
    process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
class App extends Component {
  render() {
      const title= store.getState().mainReducer.title;
    return (
      <div className="App" key={"app"}>
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h1 className="App-title" style={{color:title.color}}>{title.text}</h1>
        </header>
        <p className="App-intro" style={{color:title.subTextColor}}>{title.subText} </p>
          <Provider store={store} key={"provider"}>
                <Game key={"game"}/>
          </Provider>
      </div>
    );
  }
}

export default App;
