import { addDoc, collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { useEffect, useState } from 'react';
import Nweet from '../components/Nweet';
import { nwitter_firebase_firestore, nwitter_firebase_storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

export default function Home({ userObj }) {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState('');

  // async function getNweets() {
  //   const querySnapshot = await getDocs(collection(nwitter_firebase_firestore, 'nweets'));
  //   querySnapshot.forEach((doc) => {
  //     const nweetObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     setNweets((prev) => [nweetObj, ...prev]);
  //   });
  // }

  useEffect(() => {
    const q = query(collection(nwitter_firebase_firestore, 'nweets'));
    onSnapshot(q, (querySnapshot) => {
      const nweetArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNweets(nweetArray);
    });
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    let attachmentUrl = '';
    // 사진이 없다면, 비어있는 string을 만들기
    if (attachment !== '') {
      // 파일에 대한 레퍼런스 만들기
      const fileRef = ref(nwitter_firebase_storage, `${userObj.uid}/${uuidv4()}`);
      const res = await uploadString(fileRef, attachment, 'data_url');
      attachmentUrl = await getDownloadURL(res.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      //user
      creatorId: userObj.uid,
      attachmentUrl,
    };

    try {
      await addDoc(collection(nwitter_firebase_firestore, 'nweets'), nweetObj);
    } catch (error) {
      console.log(error);
    }
    setNweet('');
    setAttachment('');
  }

  function onChange(e) {
    const {
      target: { value },
    } = e;
    setNweet(value);
  }

  function onFileChange(e) {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  }
  function onClearPhotoClick() {
    setAttachment(null);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          value={nweet}
          onChange={onChange}
          maxLength={120}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input
          type="submit"
          value="Nweet"
        />
        {attachment && (
          <div>
            <img
              src={attachment}
              width="50px"
              height="50px"
              alt="profile"
            />
            <button onClick={onClearPhotoClick}>Clear Photo</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet, idx) => (
          <Nweet
            nweetObj={nweet}
            key={idx}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}
