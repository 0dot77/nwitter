import Router from './Router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { nwitter_firebase_auth } from '../firebase';

function App() {
  const [init, setInit] = useState(false);

  // 유저 정보
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 사용자의 로그인 상태를 체크해준다.
    // 다른 컴포넌트에서 소셜 로그인을 했을 떄의 상태도 같이 체크해준다.
    const auth = nwitter_firebase_auth;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <Router
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'init...'
      )}
    </>
  );
}

export default App;
