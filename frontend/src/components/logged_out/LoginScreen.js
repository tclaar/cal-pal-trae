import { useContext } from "react";
import { LoginContext } from "./LoggedOutWrapper";
import welcomeLogo from "../../img/calpal_logo.png";
const LoginScreen = () => {
  const { loginState, setLoginState } = useContext(LoginContext);

  const validateInput = (event) => {
    event.preventDefault();
    // Get the user input:
    const username = document.getElementById("usernameField").value;
    const password = document.getElementById("passwordField").value;

    // The only check that I'm gonna do on this end is make sure that there has been provided both a username and a password.
    if (username.length === 0 || password.length === 0) {
      setLoginState({
        ...loginState,
        feedback: "Please input both a username and password."
      });
    } else {
      setLoginState({
        ...loginState,
        input: {
          un: username,
          pw: password
        }
      });
    }
  }

  return (
    <>
      <form id="login-form">
        <img src={welcomeLogo} />
        <fieldset>
          <legend>Please sign in below:</legend>
          <div className="form-group row">
            <label htmlFor="usernameField">Username:</label>
            <input type="text" name="usernameField" id="usernameField" defaultValue={loginState.input.un} />
          </div>
          <div className="form-group row">
            <label htmlFor="passwordField">Password:</label>
            <input type="password" name="passwordField" id="passwordField" defaultValue={""} />
          </div>
          <p className="form-control-feedback">{loginState.feedback}</p>
          <button className="btn btn-primary btn-lg" onClick={validateInput}>Submit</button>
        </fieldset>
      </form>
    </>
  );
};

export default LoginScreen;