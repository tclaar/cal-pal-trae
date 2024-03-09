// address of our user api
const uri = 'http://localhost:2000/user';
// this gets so annoying to type
const HEADERS = {
  headers: { 'Content-Type': 'application/json' }
};

// Make the http request initializing account creation.
const requestAccountCreation = async () => {
  // Build the object you will need for the request.
  const user = {
    username: document.querySelector('.ACFormGroup .Username').value.trim(),
    password: document.querySelector('.ACFormGroup .Password').value.trim(),
    email: document.querySelector('.ACFormGroup .Email').value.trim()
  };
  // If any fields were blank let's not do anything.
  if (!(user.username && user.password && user.email)) return;
  const response = await fetch(uri, {
    ...HEADERS,
    method: 'POST',
    body: JSON.stringify({
      user: user
    })
  });
  const creation = await response.json();
  return creation;
};

const requestAccountDeletion = async (login) => {
  const pwInput = document.querySelector('.DeleteAcc .Password').value.trim();
  const response = await fetch(uri, {
    ...HEADERS,
    method: 'DELETE',
    body: JSON.stringify({ login: login })
  });
  const deletion = await response.json();
  return deletion;
};

const requestGetUserByUsername = async (un) => {
  const response = await fetch(uri + '/s/' + un, {
    ...HEADERS,
    method: 'GET'
  });
  const user = await response.json();
  return user;
};

export { requestAccountCreation, requestAccountDeletion, requestGetUserByUsername };
