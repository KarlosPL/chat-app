import React, { useContext, useState, useRef } from 'react';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AuthContext } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { MdOutlineClose, MdImage, MdOutlineTextFields } from 'react-icons/md';
import ThemeChanger from './ThemeChanger';
import '../styles/SettingsPopup.scss';

const SettingsPopup = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [descPopup, setDescPopup] = useState(false);
  const [imagePopup, setImagePopup] = useState(false);
  const fileInputRef = useRef(null);

  const handleClickFileInput = () => {
    fileInputRef.current.click();
  };

  const [imageUpload, setImageUpload] = useState(null);
  const [descUpload, setDescUpload] = useState(null);

  const uploadDesc = () => {
    if (descUpload == null) return;

    setDoc(
      doc(db, 'users', currentUser.uid),
      {
        desc: descUpload,
      },
      { merge: true }
    );

    updateProfile(currentUser, {
      desc: descUpload,
    });

    setDescPopup(false);
  };

  const uploadImage = () => {
    if (imageUpload == null) return;
    const avatarRef = ref(
      storage,
      `avatar/${currentUser.uid}/${imageUpload.name}`
    );
    
    uploadBytes(avatarRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setDoc(
          doc(db, 'users', currentUser.uid),
          {
            photoURL: downloadURL,
          },
          { merge: true }
        );

        updateProfile(currentUser, {
          photoURL: downloadURL,
        });
      });
    });
    setImagePopup(false);
  };

  return (
    <div className="settings-popup">
      <div className="settings-popup-content">
        <div className="settings-popup-content-header">
          <div className="settings-popup-content-header-title">
            <h2>Settings</h2>
          </div>
          <MdOutlineClose onClick={props.close} />
        </div>
        <div className="settings-popup-content-content">
          <section
            className="profile-photo-section"
            onClick={handleClickFileInput}
          >
            <p>Edit your profile picture</p>
            <MdImage />
            <input
              type="file"
              ref={fileInputRef}
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
                setImagePopup(true);
              }}
              style={{ display: 'none' }}
            />
          </section>
          {imagePopup ? (
            <div className="profile-photo-popup">
              <img
                src={URL.createObjectURL(imageUpload)}
                alt="uploaded-avatar"
              />
              <div className="profile-photo-popup-buttons-container">
                <button className="upload-button" onClick={uploadImage}>
                  Add
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setImagePopup(false)}
                >
                 Cancel
                </button>
              </div>
            </div>
          ) : null}

          <section
            className="profile-desc-section"
            onClick={() => setDescPopup(true)}
          >
            <p>Edit profile description</p>
            <MdOutlineTextFields />
          </section>
          {descPopup ? (
            <div className="profile-desc-popup">
              <h2>Edit your profile information</h2>
              <textarea
                name="set-desc-container"
                id="set-desc-container"
                maxLength={128}
                onChange={(e) => setDescUpload(e.target.value)}
              ></textarea>
              <div className="profile-desc-popup-buttons-container">
                <button className="upload-button" onClick={uploadDesc}>
                  Add
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setDescPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          <ThemeChanger />
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;
