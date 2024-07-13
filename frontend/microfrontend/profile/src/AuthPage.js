import React from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom"
import Register from "./components/Register.js";
import Login from "./components/Login.js";

import * as auth from "./utils/auth.js";

const InfoTooltip = React.lazy(() => import("shell/InfoTooltip").catch(() => {
  return { default: () => <>Component is not available!</> };
}));

export default function AuthPage({ onSuccessLogin }) {
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
        onSuccessLogin({ email })
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
        <Route path="/auth/register">
          <Register onRegister={onRegister} />
        </Route>
        <Route path="/auth/login">
          <Login onLogin={onLogin} />
        </Route>
        <Redirect from="/auth" to="/auth/login" />
      </Switch>
      <React.Suspense fallback={'Loading'}>
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </React.Suspense>
    </>
  );
}
