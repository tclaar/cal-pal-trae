import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

import { requestAccountDeletion } from "../../requests/user_requests";

const DeleteAcc = () => {
  const { userState, setUserState } = useContext(UserContext);
  return (
    <div className="DeleteAcc">
      <h3>We're sad to see you go, {userState.user.username}!</h3>
      <p>If you're certain you want to delete your account forever, enter your password and press the big red button.</p>
      <input type='password' className='Password' />
      <br />
      <button className='btn btn-lg btn-danger' onClick={async () => {
        const pw = document.querySelector('.DeleteAcc .Password').value.trim();
        requestAccountDeletion({ un: userState.user.username, pw: pw });
        setUserState({
          loggedIn: false
        });
      }}>Delete</button>
      <br />
      <Link className='btn btn-lg btn-primary' to='/settings'>Cancel</Link>
    </div>
  );
}

export default DeleteAcc;