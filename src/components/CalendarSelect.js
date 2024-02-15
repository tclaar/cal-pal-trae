import './css/CalendarSelect.css';
import React from "react";

function CalendarSelect() {
    // TODO: replace this demo list, probably with global context
    const calendars = ["Appointments", "Birthdays", "Homework"]

    // react to the add calendar button being clicked
    function addCalendar() {
        // TODO: fill in functionality, likely open calendar creation view
    }

    // react to a calendar checkbox being changed
    function setShowCalendar(e) {
        // TODO: fill in functionality, likely change global context for visible calendars
        //console.log(e.target.value + ": " + e.target.checked);
    }

    return (
        <>
            <div id="calSelect" className="dropdown-menu show" style={{}}>
                <h5 className="dropdown-header">
                    Calendars
                    {/* the add calendar button */}
                    <button id="addCal" className="btn btn-outline-secondary" type="button" onClick={addCalendar}>+</button>
                </h5>
                
                <div className="dropdown-divider"></div>
                {/* create a checkbox for each calendar */}
                {calendars.map((calendarName) => {
                    return (
                        <div className="dropdown-item form-check" key={calendarName}>
                            <label className="form-check-label" htmlFor={calendarName + "CalendarCheck"}>
                                {calendarName}
                            </label>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value={calendarName} 
                                id={calendarName + "CalendarCheck"} 
                                style={{float: "right"}} 
                                onChange={setShowCalendar}/>
                        </div>
                    )
                })}      
            </div>
        </>
    )
}
export default CalendarSelect;