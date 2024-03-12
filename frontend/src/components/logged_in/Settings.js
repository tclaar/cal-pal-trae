import React, { useContext, useState, useEffect } from 'react';
import '../css/Settings.css';

import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

import { flipTheme } from '../../requests/pref_requests';

const Settings = () => {
  // Context to access user information
  const { userState, setUserState } = useContext(UserContext);

  return (
    <div className='Settings'>
      <h1>Settings & Preferences:</h1>
      <h3>Hello {userState.user.username}!</h3>
      <Link className='btn btn-primary btn-lg' to={'/settings/upd'}>Update account</Link>
      <button className='btn btn-secondary btn-lg' onClick={async () => {
        await fetch('http://localhost:2000/auth/x/', {
          headers: {
            'Content-Type': 'application/json'
          }, method: 'POST'
        });
        setUserState({ loggedIn: false });
      }}>Sign out</button>
      <h3>Preferences:</h3>
      <button className='btn btn-primary btn-lg' onClick={async () => {
        const currentTheme = userState.user.preferences.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        await flipTheme(userState.user.username, newTheme);
        // You've changed the database - now change the app.
        const u = userState.user;
        u.preferences.theme = newTheme;
        console.log('old: ', currentTheme, ', new: ', newTheme);
        setUserState({
          ...userState,
          user: u
        });
      }}>
        Toggle Background Color</button>
      {/* Dropdown for selecting date format */}
      {/* <label>Date Format:
        <select value={selectedDateFormat} onChange={handleDateFormatChange}>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
        </select>
      </label> */}
      {/* Dropdown for selecting week start day */}
      {/* <label>Week Start:
        <select value={showWeekStartDay ? "Sunday" : "Monday"} onChange={handleWeekStartDay}>
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
        </select>
      </label> */}
      {/* Dropdown for selecting time format */}
      {/* <label>Time Format:
        <select value={selectedTimeFormat} onChange={handleTimeFormatChange}>
          <option value="12">12-Hour</option>
          <option value="24">24-Hour</option>
        </select>
      </label> */}
      <br />
      <h3>More options:</h3>
      {/* Link to delete account */}
      <Link className='btn btn-lg btn-danger' to='/settings/del'>
        Delete account
      </Link>
    </div>
  );
};


export default Settings;