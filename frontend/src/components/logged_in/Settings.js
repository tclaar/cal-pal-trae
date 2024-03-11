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

// function Settings() {
//   const {calendars} = useContext(CalendarContext);
//   const [selectedLanguage, setSelectedLanguage] = useState('English');
//   const [selectedCountry, setSelectedCountry] = useState('United States');
//   const [selectedDateFormat, setSelectedDateFormat] = useState('MM/DD/YYYY');
//   const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('#80FF80'); 
//   const [selectedNotifications, setSelectedNotifications] = useState('English');
//   const [showCompletedTasks, setShowCompletedTasks] = useState(false);
//   const [showWeekends, setShowWeekends] = useState(true);
//   const [showInvites, setShowInvites] = useState(true);

//   const handleLanguageChange = (event) => {
//     setSelectedLanguage(event.target.value);

//   };

//   const handleCountryChange = (event) => {
//     setSelectedCountry(event.target.value);
//   };

//   const handleDateFormatChange = (event) => {
//     setSelectedDateFormat(event.target.value);
//   };

//   const handleBackgroundColorChange = (event) => {
//     setSelectedBackgroundColor(event.target.value);
//   };

//   const handleNotifications = (event) => {
//     setSelectedNotifications(event.target.value);
//   }
//   const handleShowCompletedTasksChange = () => {
//     setShowCompletedTasks(!showCompletedTasks);

//   };

//   const handleShowWeekendsChange = () => {
//     setShowWeekends(!showWeekends);

//   };

//   const handleShowInvitesChange = () => {
//     setShowInvites(!showInvites);

//   };


//   return (
//     <div>
//       <h3>Settings</h3>

//       <label>
//         Language:
//         <select value={selectedLanguage} onChange={handleLanguageChange}>
//           <option value="English">English</option>
//           <option value="Spanish">Spanish</option>
//         </select>
//       </label>

//       <label>
//         Country:
//         <select value={selectedCountry} onChange={handleCountryChange}>
//           <option value="United States">United States</option>
//           <option value="Canada">Canada</option>
//         </select>
//       </label>

//       <label>
//         Date Format:
//         <select value={selectedDateFormat} onChange={handleDateFormatChange}>
//           <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//           <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//         </select>
//       </label>

//       <label>
//         Background Color:
//         <input type="color" value={selectedBackgroundColor} onChange={handleBackgroundColorChange} 
//         style={{width: '12%'}} />
//       </label>

//       <label>
//         Notifications:
//         <select value={selectedLanguage} onChange={handleLanguageChange}>
//         </select>
//       </label>

//       <div className="checkbox">
//       <label>
//         Show Completed Tasks:
//         <input
//           type="checkbox"
//           name="notificationOption"
//           checked={showCompletedTasks}
//           onChange={handleShowCompletedTasksChange}
//         />
//       </label>

//       <label>
//         Show Weekends:
//         <input
//           type="checkbox"
//           name="notificationOption"
//           checked={showWeekends}
//           onChange={handleShowWeekendsChange}
//         />
//       </label>

//       <label>
//         Show Invites:
//         <input
//           type="checkbox"
//           name="notificationOption"
//           checked={showInvites}
//           onChange={handleShowInvitesChange}
//         />
//       </label>

//     </div>
//     </div>
//   );
// };

export default Settings;