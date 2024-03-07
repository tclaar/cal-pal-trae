import '../css/CalendarSelect.css';
import React, { useContext }from "react";
import {CalendarContext} from './LoggedInWrapper';

function CalendarSelect() {
    const [calendars, setCalendars] = useContext(CalendarContext);

    // react to the add calendar button being clicked
    function addCalendar() {
        // TODO: fill in functionality, likely open calendar creation view
    }

    // react to a calendar checkbox being changed
    function setShowCalendar(e) {
        const newCals = JSON.parse(JSON.stringify(calendars));
        newCals[e.target.value].visible = e.target.checked;
        setCalendars(newCals);
    }

    return (
        <>
            <div id="calSelect" className="dropdown-menu show">
                <h5 className="dropdown-header">
                    Calendars
                    {/* the add calendar button */}
                    <button id="addCal" className="btn btn-outline-secondary" type="button" onClick={addCalendar}>+</button>
                </h5>
                
                <div className="dropdown-divider"></div>
                {/* create a checkbox for each calendar */}
                {Object.keys(calendars).map((key) => {
                    return (
                        <div className="dropdown-item form-check" key={key}>
                            <label className="form-check-label" htmlFor={key + "CalendarCheck"}>
                                {calendars[key].name}
                            </label>
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
