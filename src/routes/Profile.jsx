import { useNavigate } from 'react-router-dom';
import { nwitter_firebase_auth } from '../firebase';

export default function Profile() {
  const nav = useNavigate();

  function onLogOutClick() {
    nwitter_firebase_auth.signOut();
    nav('/');
  }
  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
}
