import React from "react";

import AddPlacePopup from "./components/AddPlacePopup";
import Card from "./components/Card";

import api from "shell/api";
import eventBus from "shell/eventBus";
import { CurrentUserContext } from 'shell/CurrentUserContext';

import './index.css'

const ImagePopup = React.lazy(() => import("shell/ImagePopup").catch(() => {
  return { default: () => <>ImagePopup is not available!</> };
}));

export default function Places() {
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] =
    React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState(null);

  const currentUser = React.useContext(CurrentUserContext);


  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  function onAddPlace() {
    setIsAddPlacePopupOpen(true);
  }

  React.useEffect(() => {
    eventBus.on('onAddPlace', onAddPlace);

    return () => eventBus.removeListener('onAddPlace', onAddPlace);
  }, [])

  React.useEffect(() => {
    api
      .getCardList()
      .then(cards => cards.reverse())
      .then(setCards)
      .catch((err) => console.log(err));
  }, []);

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))}
        </ul>
      </section>

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onAddPlace={handleAddPlaceSubmit}
        onClose={closeAllPopups}
      />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

    </>
  );
}
