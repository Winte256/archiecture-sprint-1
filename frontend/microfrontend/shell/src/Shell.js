import React from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import api from "./utils/api";
import { CurrentUserContext } from "./contexts/CurrentUserContext";

import { checkToken } from 'auth/authUtils';


const AuthPage = React.lazy(() => import('auth/AuthPage').catch(() => {
  return { default: () => <>Component is not available!</> };
}));

export default function Shell() {
  // const [cards, setCards] = React.useState([]);

  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const history = useHistory();



  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        setCurrentUser(userData);
        // setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);


  React.useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      checkToken(token)
        .then((res) => {
          console.log("res", res)
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
          {/* <ProtectedRoute
            exact
            path="/"
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={isLoggedIn}
          /> */}

          <Route path="/auth">
            <React.Suspense fallback={'Loading'}>
              <AuthPage onSuccess={onSuccessLogin} />
            </React.Suspense>
          </Route>

        </Switch>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}