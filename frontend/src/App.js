import './App.css';

import { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
// TODO: use these imports to make /welcome, /login, /create_account

import LoggedInWrapper from './components/logged_in/LoggedInWrapper';
import LoggedOutWrapper from './components/logged_out/LoggedOutWrapper';


/**
 * A completely global context. Stores user data.
 * It is null upon startup, and after logging out, 
 * which results in the Logged_out components being shown.
 */
const UserContext = createContext(null);

/**
 * The wrapper for the whole application. Provider for UserContext, the only
 * completely global context.
 */
function App() {

  // Use useState to get a getter and setter for the context.
  const [userState, setUserState] = useState({
    loggedIn: false
  });

  // The initial value of the context, which contains both the userState and setUserState.
  //    Note: This is the way that I was able to make it work in assignment 3, and I liked it. Let me know what y'all think though. -Devin
  const initialValue = { userState, setUserState };
  
  // The content of the app: either LoggedOutWrapper or LoggedInWrapper.
  let content;
  if (!userState.loggedIn) {
    content = <LoggedOutWrapper />;
  } else {
    content = <LoggedInWrapper />;
  }

  return (
    <UserContext.Provider value={initialValue}>
      {content}
    </UserContext.Provider>
  );
}

export default App;
export { UserContext };