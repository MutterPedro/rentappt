import React from "react";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { rootReducer, sagas } from "../../state";
import "./App.css";
import Login from "../Login";
import Apartments from "../Apartments";
import Header from "../Header";

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagas.forEach(saga => sagaMiddleware.run(saga));

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <div className="App">
        <Header />
        <Router>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/explore">
              <Apartments />
            </Route>
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
