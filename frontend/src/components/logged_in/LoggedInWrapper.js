import '../css/CalendarSelect.css';
import '../css/WeekView.css';

import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserContext } from '../../App';
import WeekView from './WeekView';
import Header from './Header';
import NavBar from './NavBar';
import NewEvent from './NewEvent';
import EditEvent from './EditEvent';
import Settings from './Settings';
import DeleteAcc from './DeleteAcc';
import Messages from './Messages';
import NewCalendar from './NewCalendar';
import EditCalendar from './EditCalendar';
import UpdateAcc from './UpdateAcc';
import DevStats from './DevStats';

const CalendarContext = createContext(null);
const EventContext = createContext(null);

const LoggedInWrapper = () => {

  const { userState, setUserState } = useContext(UserContext);

  const [calendars, setCalendars] = useState({});
  const [selectedCalendar, setSelectedCalendar] = useState({});
  const [event, setEvent] = useState(null);

  async function refreshCalendars() {
    try {
      // first, update the user object
      const response = await fetch(`http://localhost:2000/user/s/${userState.user.username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const userData = await response.json();
      setUserState({
        user: userData.user,
        loggedIn: userState.loggedIn,
        developer: userState.developer
      });

      // then, refresh calendar data
      const newCalendars = {};
      for (const id of userData.user.calendars) {
        const response = await fetch(`http://localhost:2000/calendar/${id}`, {
          method: "GET"
        });
        const calendar = (await response.json()).calendar;
        calendar.visible = true;
        newCalendars[id] = calendar;
      }
      setCalendars(newCalendars);
    } catch (error) {
      console.error("Unable to fetch calendars: " + error);
    }
  }
  
  useEffect(() => {
    const theme = userState.user.preferences.theme;
    const oldTheme = theme === 'light' ? 'dark' : 'light';
    const newClass = `${theme}-mode`;
    const oldClass = `${oldTheme}-mode`;

    document.body.classList.remove(oldClass);
    document.body.classList.add(newClass);
    
  }, [userState.user.preferences.theme])


  useEffect(() => {
    refreshCalendars();
  }, []);

  return userState.developer ? <DevStats /> : (
    <>
      <BrowserRouter>
        <CalendarContext.Provider value={{
          calendars, 
          setCalendars, 
          refreshCalendars, 
          selectedCalendar,
          setSelectedCalendar
        }}>
          <Header/>
          <div className="container">
            <EventContext.Provider value={[event, setEvent]}>
              <Routes>
                <Route path="/month/" element={<h1>Month</h1>} />
                <Route path="/" element={<WeekView />} />
                <Route path="/edit-event" element={<EditEvent />} />
                <Route path="/new-event" element={<NewEvent />} />
                <Route path="/messages/" element={<Messages />} />
                <Route path="/new-calendar" element={<NewCalendar />} />
                <Route path="/edit-calendar" element={<EditCalendar />} />
                <Route path="/settings/" element={<Settings />} />
                <Route path="/settings/del" element={<DeleteAcc />} />
                <Route path='/settings/upd' element={<UpdateAcc />} />
              </Routes>
            </EventContext.Provider>
          </div>
          <NavBar />
        </CalendarContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default LoggedInWrapper;
export { CalendarContext, EventContext };