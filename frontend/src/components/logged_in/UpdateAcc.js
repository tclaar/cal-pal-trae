import { useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import {
  requestAccountUpdate,
  requestGetUserById
} from '../../requests/user_requests';
const UpdateAcc = () => {
  const { userState, setUserState } = useContext(UserContext);
  console.log(userState);
  return (
    <div className='UpdateAcc'>
      <h3>Make changes to your account:</h3>
      <p>User Id (unchangeable): {userState.user._id.toString()}</p>
      <p>Username: {userState.user.username}</p>
      <ChangeForm field='username' />
      <p>Email address: {userState.user.email}</p>
      <ChangeForm field='email' />
      <p>
        Password: <em>hidden</em>
      </p>
      <ChangeForm field='password' />
      <Link
        to='/settings'
        className=' btn btn-large btn-secondary'
      >
        Cancel
      </Link>
    </div>
  );
};

const ChangeForm = ({ field }) => {
  const { userState, setUserState } = useContext(UserContext);

  const updateField = async () => {
    const input = document
      .querySelector(`.change${field} .${field}`)
      .value.trim();
    const feedback = document.querySelector(`.change${field} .feedback`);
    const change = {};
    change[field] = input;
    const update = await requestAccountUpdate(
      userState.user.username,
      change,
      document.querySelector('.ChangeForm .pwCheck').value.trim() ?? ''
    );

    if (update.success) {
      feedback.innerHTML = 'success';
      const user = await requestGetUserById(userState.user._id);
      setUserState({
        ...userState,
        user: user.user
      });
    } else {
      feedback.innerHTML = update.error;
    }
  };

  const pwCheck =
    field === 'password' ? (
      <>
        <label>Confirm old password:</label>
        <input
          type='password'
          className='pwCheck'
        />
      </>
    ) : (
      <></>
    );

  return (
    <div className={'ChangeForm change' + field}>
      {pwCheck}
      <label>New {field}:</label>
      <input
        type={field === 'password' ? 'password' : 'text'}
        className={field}
        defaultValue={field === 'password' ? '' : userState.user[field]}
      />
      <button
        className='btn btn-sm btn-danger'
        onClick={updateField}
      >
        Update {field}
      </button>
      <br />
      <span className='feedback'></span>
      <br />
      <hr />
    </div>
  );
};

export default UpdateAcc;
