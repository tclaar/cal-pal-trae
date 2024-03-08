import { useContext } from "react";
import { requestAccountCreation, requestGetUserByUsername } from "../../requests/user_requests";
import { UserContext } from "../../App";

const AccountCreationScreen = () => {
  const { userState, setUserState } = useContext(UserContext);

  return (
    <div className="AccountCreationScreen">
      {/* Maybe do a little selling here, also offer ourselves direction: */}
      <h2>With a standard CalPal account, you can:</h2>
      <ul>
        <li>Create your own events and calendars.</li>
        <li>Share calendars with other users.</li>
        <li>Send messages and form groups.</li>
        <li>... and more!</li>
      </ul>
      <AccountCreationForm />
      <button className='btn btn-primary btn-lg' onClick={async () => {
        const creation = await requestAccountCreation();
        if (creation.success) {
          const get = await requestGetUserByUsername(document.querySelector('.ACFormGroup .Username').value.trim());
          if (get.success) {
            setUserState({
              loggedIn: true,
              user: get.user
            });
          } else {
            console.log('getting failed immediately after failing. this should not happen.');
          }
        } else {
          const feedback = document.querySelector('#account-creation-fb');
          feedback.innerHTML = creation.error;
        }
      }}>Create account</button>
      <span id='account-creation-fb'></span>
    </div>
  );
};

const AccountCreationForm = () => {
  return (
    <div className="AccountCreationForm">
      <ACFormGroup field="Username" />
      <ACFormGroup field="Password" />
      <ACFormGroup field="Email" />
    </div>
  );
};

const ACFormGroup = (props) => {
  return (
    <div className="ACFormGroup form-group row">
      <label htmlFor={props.field}>{props.field}</label>
      <input type={props.field === 'Password' ? 'password' : 'text'} className={props.field} />
    </div>
  );
};

export default AccountCreationScreen;