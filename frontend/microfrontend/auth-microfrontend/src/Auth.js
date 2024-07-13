import React from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Register from "./components/Register.js";
import Login from "./components/Login.js";

import * as auth from "./utils/auth.js";

import InfoTooltip from "host/InfoTooltip";

function App({ onSuccess }) {
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const closeAllPopups = () =>
    setIsInfoToolTipOpen(false);

  const history = useHistory();

  function onRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        onSuccess({ email })
        // setIsLoggedIn(true);
        // setEmail(email);
        history.push("/");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  return (
    <>
      <Switch>
        <Route path="/signup">
          <Register onRegister={onRegister} />
        </Route>
        <Route path="/">
          <Login onLogin={onLogin} />
        </Route>
      </Switch>
      <InfoTooltip
        isOpen={isInfoToolTipOpen}
        onClose={closeAllPopups}
        status={tooltipStatus}
      />
    </>
  );
}

export default App;
