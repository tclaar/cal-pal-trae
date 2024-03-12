const flipTheme = async (username, to) => {
  const response = await fetch(`http://localhost:2000/preferences/${username}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify({
      changes: {
        theme: to
      }
    })
  });
  const status = await response.json();
  return status;
};

module.exports = { flipTheme };