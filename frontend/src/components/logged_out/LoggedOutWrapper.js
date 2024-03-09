import '../css/logged_out.css';

import { createContext, useContext, useEffect, useState } from 'react';

import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import AccountCreationScreen from './AccountCreationScreen';

import { UserContext } from '../../App';

/** 
 * The LoginContext only exists when UserContext === null.
 * Holds the user input, whether it's a match or not, as well as the action that the
 * user is doing (to determine what screen to show).
 */
const LoginContext = createContext(null);

const LoggedOutWrapper = () => {
// Set the initial state of the loginContext.
  const [loginState, setLoginState] = useState({
    input: {
      un: "",
      pw: ""
    },
    match: {
      un: false, // does the username exist in the database?
      pw: false // does password match the given username?
    },
    action: null // null, "login", or "create"
  });

  // Fetch the UserContext.
  const { userState, setUserState } = useContext(UserContext);

  // Upon a change in loginState.input, we're going to attempt to login by comparing
  // the user input to the records in the database.
  useEffect(() => {
    /** Calls our login API. */
    const attemptLogin = async () => {
      // Address to our login web service.
      const uri = encodeURI("http://localhost:2000/auth");
      // Do the job!
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          login: loginState.input
        })
      });
      // This is the object that we want, which holds all the info about
      // the correctness of login info.
      const obj = await response.json();
      console.log("Logging Response:", obj);

      if (obj.error){
        // Something went wrong. That's ok, just give the user the error message in feedback.
        setLoginState({
          ...loginState,
          feedback: obj.error
        });
      } else if (obj.success) {
        // Logging in has been successful! You're gonna finish this request, then you're going to call
        // the next API to retrieve public user information.
        const uri2 = encodeURI(`http://localhost:2000/user/s/${loginState.input.un}`);
        // Do the job!
        const response2 = await fetch(uri2, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        // This is the object that we want, which holds all the information we need from the response.
        const obj2 = await response2.json();
        console.log("Logging Public User Information:", obj2);
        // Update the UserContext, leading to the LoggedInWrapper to take effect.
        console.log("Updating UserContext");
        setUserState({
          user: obj2.user,
          loggedIn: true,
          calendars: [
            "65e78634451a8fd7eb403bfe",
          ]
        });
        console.log(userState);
      }
    };

    // Actually call the previously defined function upon attempting to sign in.
    if (loginState.action !== null) {
      console.log("Attempting to login.");
      attemptLogin();
    }
  }, [loginState.input]);

  // The initial value of the LoginContext.
  const initialValue = { loginState, setLoginState };
  
  // Determine the content to be shown on the screen.
  let content;
  if (loginState.action === null) {
    // User has not chosen what to do.
    content = <WelcomeScreen />;
  } else if (loginState.action === "login") {
    // User wants to log into an existing account.
    content = <LoginScreen />;
  } else if (loginState.action === "create") {
    // User wants to create a new account.
    content = <AccountCreationScreen />;
  }

  return (
    <LoginContext.Provider value={initialValue}>
      { content }
    </LoginContext.Provider>
  );
};

export default LoggedOutWrapper;
export { LoginContext };