import React, { useContext, useState } from 'react';
import '../css/Settings.css';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { userState, setUserState } = useContext(UserContext);

  return (
    <div className='Settings'>
      <h3>Hello {userState.user.username}!</h3>
      <button className='btn btn-primary btn-lg'>Update account</button>
      <button className='btn btn-secondary btn-lg'>Sign out</button>
      <h3>Preferences:</h3>
      <br />
      <br />
      <h3>More options:</h3>
      <Link className='btn btn-lg btn-danger' to='/settings/del'>Delete account</Link>
    </div>
  );
};

// function Settings() {
//   const [calendars] = useContext(CalendarContext);
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


