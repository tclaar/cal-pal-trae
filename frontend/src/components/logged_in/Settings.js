import React, { useContext, useState, useEffect } from 'react';
import '../css/Settings.css';

import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Settings = () => {
  // Context to access user information
  const { userState, setUserState } = useContext(UserContext);

  // State variables for settings
  const [selectedDateFormat, setSelectedDateFormat] = useState(localStorage.getItem('selectedDateFormat') || 'MM/DD/YYYY');
  const [showWeekStartDay, setWeekStartDay] = useState(localStorage.getItem('showWeekStartDay') === 'true');

  // Function to toggle between light and dark modes
  const toggleMode = () => {
    const body = document.body;
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');

    const currentMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('themeMode', currentMode);
  };

  // State variable for selected time format
  const [selectedTimeFormat, setSelectedTimeFormat] = useState(() => {
    return localStorage.getItem('selectedTimeFormat') || '12';
  });

  // Handler for changing the time format
  const handleTimeFormatChange = (event) => {
    setSelectedTimeFormat(event.target.value);
    localStorage.setItem('selectedTimeFormat', event.target.value);
  };

  // Apply the initial theme based on the saved mode in local storage
  const applyInitialTheme = () => {
    const body = document.body;
    const savedMode = localStorage.getItem('themeMode');

    if (savedMode === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.add('light-mode');
    }
  };

  // Handler for changing the date format
  const handleDateFormatChange = (event) => {
    setSelectedDateFormat(event.target.value);
    localStorage.setItem('selectedDateFormat', event.target.value);
  };

  // Handler for changing the week start day
  const handleWeekStartDay = () => {
    setWeekStartDay(!showWeekStartDay);
    localStorage.setItem('showWeekStartDay', (!showWeekStartDay).toString());
  };

  // Apply the initial theme when the component mounts
  useEffect(() => {
    applyInitialTheme();
  }, []);

  return (
    <div className='Settings'>
      <h1>Settings & Preferences:</h1>
      <h3>Hello {userState.user.username}!</h3>
      <button className='btn btn-primary btn-lg'>Update account</button>
      <button className='btn btn-secondary btn-lg'>Sign out</button>
      <h3>Preferences:</h3>
      <button className='btn btn-primary btn-lg' onClick={toggleMode}>
        Toggle Background Color</button>
      {/* Dropdown for selecting date format */}
      <label>Date Format:
        <select value={selectedDateFormat} onChange={handleDateFormatChange}>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
        </select>
      </label>
      {/* Dropdown for selecting week start day */}
      <label>Week Start:
        <select value={showWeekStartDay ? "Sunday" : "Monday"} onChange={handleWeekStartDay}>
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
        </select>
      </label>
      {/* Dropdown for selecting time format */}
      <label>Time Format:
        <select value={selectedTimeFormat} onChange={handleTimeFormatChange}>
          <option value="12">12-Hour</option>
          <option value="24">24-Hour</option>
        </select>
      </label>
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