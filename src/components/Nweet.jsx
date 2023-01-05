import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { nwitter_firebase_firestore, nwitter_firebase_storage } from '../firebase';
import { useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';

export default function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  function toggleEditing() {
    setEditing((prev) => !prev);
  }

  async function onSubmit(e) {
    e.preventDefault();

    await updateDoc(doc(nwitter_firebase_firestore, 'nweets', `${nweetObj.id}`), { text: newNweet });
    setEditing(false);
  }

  function onChange(e) {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  }
  async function onDeleteClick() {
    const ok = confirm('Are you sure you want to delete this nweet?');

    if (ok) {
      // delete nweet
      // 도큐먼트에서 작성자를 찾아서 데이터를 지워주는 것이다.
      await deleteDoc(doc(nwitter_firebase_firestore, 'nweets', `${nweetObj.id}`));
      await deleteObject(ref(nwitter_firebase_storage, nweetObj.attachmentUrl));
    }
  }
  return (
    <>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              value={newNweet}
              type="text"
              placeholder="Edit your nweet"
              required
              onChange={onChange}
            />
            <input
              type="submit"
              value="Update Nweet"
            />
          </form>
          <button onClick={toggleEditing}>Cancle</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img
              src={nweetObj.attachmentUrl}
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </>
  );
}
