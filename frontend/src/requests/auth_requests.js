const uri = 'http://localhost:2000/auth';
// this gets so annoying to type
const HEADERS = {
  headers: { 'Content-Type': 'application/json' }
};

const requestAuthentication = async (login) => {
  // If there's not valid info, just give up.
  if (!(login && login.un && login.pw)) return;
  const response = await fetch(uri, {
    ...HEADERS,
    method: 'POST',
    body: JSON.stringify(login)
  });
  const authentication = await response.json();
  return authentication;
};

export { requestAuthentication };