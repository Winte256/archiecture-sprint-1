import React from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./utils/api";
import { CurrentUserContext } from "shell/CurrentUserContext";
import eventBus from 'shell/eventBus'

import { checkToken } from 'auth/authUtils';
import MainContent from "./components/MainContent";


const AuthPage = React.lazy(() => import('auth/AuthPage').catch(() => {
  return { default: () => <>Component is not available!</> };
}));

export default function Shell() {
  const [currentUser, setCurrentUser] = React.useState({});

  const updateUser = (userData) => {
    setCurrentUser(userData)
  }

  React.useEffect(() => {
    eventBus.on('changeCurrentUser', updateUser);

    return () => eventBus.removeListener('changeCurrentUser', updateUser)
  }, [])

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const history = useHistory();


  React.useEffect(() => {
    api
      .getUserInfo()
      .then(setCurrentUser)
      .catch((err) => console.log(err));
  }, []);


  React.useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);


  function onSuccessLogin({ email }) {
    console.log({ email })
    setIsLoggedIn(true);
    setEmail(email);
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/auth");
  }

  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
    <CurrentUserContext.Provider value={currentUser} >
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          {/*Роут / защищён HOC-компонентом ProtectedRoute*/}
          <ProtectedRoute
            exact
            path="/"
            component={MainContent}
            loggedIn={isLoggedIn}
          />

          <Route path="/auth">
            <React.Suspense fallback={'Loading'}>
              <AuthPage onSuccessLogin={onSuccessLogin} />
            </React.Suspense>
          </Route>

        </Switch>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}