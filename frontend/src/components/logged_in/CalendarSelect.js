import '../css/CalendarSelect.css';
import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import {CalendarContext} from './LoggedInWrapper';

function CalendarSelect() {
    const {calendars, setCalendars, setSelectedCalendar} = useContext(CalendarContext);

    // react to the add calendar button being clicked
    function addCalendar() {
        setSelectedCalendar({ 
            event_types: [],
            added_event_types: [],
            events: []
        });
    }

    // react to a calendar checkbox being changed
    function setShowCalendar(e) {
        const newCals = JSON.parse(JSON.stringify(calendars));
        newCals[e.target.value].visible = e.target.checked;
        setCalendars(newCals);
    }

    function handleEditCalendar(id) {
        calendars[id].added_event_types = [];
        setSelectedCalendar(calendars[id]);
    }

    return (
        <>
            <div id="calSelect" className="dropdown-menu show">
                <h5 className="dropdown-header">
                    Calendars
                    {/* the add calendar button */}
                    <Link id="addCal" className="btn btn-outline-secondary" to="/new-calendar/" onClick={addCalendar}>+</Link>
                </h5>
                
                <div className="dropdown-divider"></div>
                {/* create a checkbox for each calendar */}
                {Object.keys(calendars).map((key) => {
                    return (
                        <div className="dropdown-item form-check" key={key}>
                            <Link 
                                className="form-check-label" 
                                htmlFor={key + "CalendarCheck"} 
                                to="/edit-calendar/"
                                onClick={() => handleEditCalendar(key)}
                            >
                                {calendars[key].name}
                            </Link>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value={key} 
                                id={key + "CalendarCheck"} 
                                style={{float: "right"}} 
                                onChange={setShowCalendar}
                                checked={calendars[key].visible}/>
                        </div>
                    )
                })}      
            </div>
        </>
    )
}
export default CalendarSelect;
