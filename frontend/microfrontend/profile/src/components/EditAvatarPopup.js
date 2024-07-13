import React from 'react';


const PopupWithForm = React.lazy(() => import("shell/PopupWithForm").catch(() => {
  return { default: () => <>Component is not available!</> };
}));
function EditAvatarPopup({ isOpen, onUpdateAvatar, onClose }) {
  const inputRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <React.Suspense fallback={'Loading'}>
      <PopupWithForm
        isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose} title="Обновить аватар" name="edit-avatar"
      >

        <label className="popup__label">
          <input type="url" name="avatar" id="owner-avatar"
            className="popup__input popup__input_type_description" placeholder="Ссылка на изображение"
            required ref={inputRef} />
          <span className="popup__error" id="owner-avatar-error"></span>
        </label>
      </PopupWithForm>
    </React.Suspense>
  );
}

export default EditAvatarPopup;
