import React, { useState } from "react";
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
import SideBar from "../SideBar";
import NewApartment from "../NewApartment";
import NewUser from "../NewUser";
import Users from "../Users";

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagas.forEach(saga => sagaMiddleware.run(saga));

function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <Provider store={store}>
      <ToastContainer />
      <div className="App" onClick={() => menuVisible && setMenuVisible(false)}>
        <Header onClickSettings={() => setMenuVisible(!menuVisible)} />
        <Router>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/explore">
              <Apartments />
            </Route>
            <Route exact path="/newApartment">
              <NewApartment />
            </Route>
            <Route exact path="/newUser">
              <NewUser />
            </Route>
            <Route exact path="/users">
              <Users />
            </Route>
          </Switch>
          <SideBar visible={menuVisible} />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
