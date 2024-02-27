import '../css/CalendarSelect.css';
import '../css/WeekView.css';

import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserContext } from '../../App';
import WeekView from './WeekView';
import Header from './Header';
import NavBar from './NavBar';

const CalendarContext = createContext(null);

const LoggedInWrapper = () => {

  const { userState, setUserState } = useContext(UserContext);
  console.log(userState);

  // demo data
  const calCtxValue = { 
    '1': {
      name: "Appointments",
      events: [
        // event list could be populated with event objects fetched using the event ID list 
        // contained in the response from the calendar web service
        {
          name: "Dentist",
          date_range: [ '2024-02-20', '2024-02-28' ],
          time_range: [ '9:00 AM', '11:30 AM' ]
        },
        {
          name: "DMV",
          date_range: [ '2024-02-21', ],
          time_range: [ '9:00 AM' , '10:00 AM']
        }
      ],
      visible: true
    },
    '2': {
      name: "Meals",
      events: [
        {
          name: "tacos",
          date_range: [ '2024-02-20' ],
          time_range: [ ]
        }
      ],
      visible: true
    }
  }

  const [calendars, setCalendars] = useState(calCtxValue);

  return (
    <>
      <BrowserRouter>
        <CalendarContext.Provider value={[calendars, setCalendars]}>
          <Header/>
          <div className="container">
            <Routes>
              <Route path="/month/" element={<h1>Month</h1>} />
              <Route path="/" element={<WeekView />} />
              <Route path="/messages/" element={<h1>Messages</h1>} />
              <Route path="/settings/" element={<h1>Settings</h1>} />
            </Routes>
          </div>
          <NavBar />
        </CalendarContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default LoggedInWrapper;
export { CalendarContext };