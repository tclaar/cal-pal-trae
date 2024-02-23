import { useContext } from 'react';
import { LoginContext } from './LoggedOutWrapper';
import calpalLogo from '../../img/calpal_logo.png';
import '../css/logged_out.css';

const WelcomeScreen = () => {
  const { loginState, setLoginState } = useContext(LoginContext);
  
  const goToLogin = () => {
    setLoginState({
      ...loginState, 
      action: "login"
    });
  };

  const goToCreate = () => {
    setLoginState({
      ...loginState,
      action: "create"
    });
  };

  return (
    <>
      <img className='welcome-logo' src={calpalLogo} />
      <h1 className='text-center'>Welcome to CalPal!</h1>
      <div className='welcomeButtons'>
        <button className="btn btn-primary btn-block" onClick={goToLogin}>
          Sign In
        </button>
        <button className="btn btn-secondary" onClick={goToCreate}>
          Create a new Account
        </button>
      </div>
    </>
  );
};

export default WelcomeScreen;