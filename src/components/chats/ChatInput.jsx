import React, { useContext, useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { v4 as uuid } from 'uuid';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { MdOutlineAttachFile, MdOutlineEmojiEmotions, MdSend } from 'react-icons/md';
import { db, storage } from '../../firebase';
import '../../styles/ChatInput.scss';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const ChatInput = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    setLoading(true);
    if (!text && !img) return;
    if (img) {
      if (
        img.type !== 'image/jpeg' &&
        img.type !== 'image/png' &&
        img.type !== 'image/jpg' &&
        img.type !== 'image/gif'
      )
        return;

      const storageRef = ref(storage, `chatsImages/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log('Error while uploading image: ' + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
            await updateDoc(doc(db, 'userChats', currentUser.uid), {
              [data.chatId + '.lastMessage']: {
                text,
                img: downloadURL,
              },
              [data.chatId + '.date']: serverTimestamp(),
            });

            await updateDoc(doc(db, 'userChats', data.user.uid), {
              [data.chatId + '.lastMessage']: {
                text,
                img: downloadURL,
              },
              [data.chatId + '.date']: serverTimestamp(),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [data.chatId + '.lastMessage']: {
          text,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChats', data.user.uid), {
        [data.chatId + '.lastMessage']: {
          text,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });
    }

    setText('');
    setPreview(null);
    setImg(null);
    setLoading(false);
  };

  const handleKey = (key) => {
    key.code === 'Enter' && handleSend();
  };

  useEffect(() => {
    if (!img) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(img);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [img]);

  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setText((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleInput = (e) => {
    setText(e.target.value);
  };

  const inputPicker = () => {
    !showPicker ? setShowPicker(showPicker) : setShowPicker(!showPicker);
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        maxLength={256}
        name="messagebar"
        id="messagebar"
        placeholder="Write a message..."
        autoComplete="off"
        onClick={inputPicker}
        onChange={handleInput}
        onKeyDown={handleKey}
        value={text}
      />
      <div className="chat-input-icons">
        <div className="icon emoji">
          <span className="iconText fi">Emojis</span>
          <label htmlFor="emoji">
          <MdOutlineEmojiEmotions onClick={() => setShowPicker(!showPicker)} />
          </label>
        </div>
        <div className="picker">
          {showPicker && (
            <EmojiPicker
              pickerStyle={{ width: '100&' }}
              onEmojiClick={onEmojiClick}
            />
          )}
        </div>
        <div className="icon file">
          <input
            type="file"
            style={{ display: 'none' }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <span className="iconText fi">Attachments</span>
          <label htmlFor="file">
            <MdOutlineAttachFile />
          </label>
        </div>
        <MdSend id="send" disabled={loading} onClick={handleSend} />
      </div>
      <div className="photo-preview">
        {img &&
        (img.type === 'image/jpeg' ||
          img.type === 'image/png' ||
          img.type === 'image/jpg' ||
          img.type === 'image/gif') ? (
          <img src={preview} alt="preview" />
        ) : null}
      </div>
    </div>
  );
};

export default ChatInput;
