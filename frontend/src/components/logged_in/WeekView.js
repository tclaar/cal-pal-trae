// CalPal
// WeekView.js
// Trae Claar

import '../css/WeekView.css';
import '../../images/maps-icon.png';

//import mapAPIKey from "../../config/map_api_key.json";

import React, {useState, useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { CalendarContext, EventContext } from './LoggedInWrapper';

function WeekView() {
    // date object for today's date
    const today = new Date(new Date().toISOString().split('T')[0] + "T00:00:00");
    // date object for the start of this week
    const thisWeekStart = dateIncremented(today, -today.getDay());

    const [weekStart, setWeekStart] = useState(thisWeekStart);

    // Helper function that returns a string specifying the week's date range.
    // return format: "<Month 1> <Day 1> - <Month 2>? <Day 2>"
    // (e.g. "February 18 - 24" or "February 25 - March 2")
    function buildWeekString() {
        const weekEnd = dateIncremented(weekStart, 6);
        const startMonth = weekStart.toLocaleString("default", {month: "long"});
        const endMonth = weekEnd.toLocaleString("default", {month: "long"});
        return startMonth + " " + weekStart.getDate() + " - " 
            + ((startMonth !== endMonth) ? endMonth + " " : "") + weekEnd.getDate();
    }

    // Helper function that returns a new date object corresponding to the provided
    // date object with its date incremented by the given amount.
    function dateIncremented(date, amount) {
        const result = new Date(date);
        result.setDate(date.getDate() + amount);
        return result;
    }

    // Increment the current week by the provided amount. For example, a call with
    // amount = 1 will set the following week as the current week.
    function incrementWeek(amount) {
        setWeekStart(dateIncremented(weekStart, 7 * amount));
    }

    return (
        <>
            <div className="page-header">
                <h3 id="viewTitle">Week of {buildWeekString()}</h3>

                {/* Buttons for changing the current week. */}
                <span id="change-week" className="container">
                    <button className="change-week-btn btn btn-outline-secondary" type="button"
                        onClick={() => { incrementWeek(1) }}>{">"}</button>
                    <button className="change-week-btn btn btn-outline-secondary" type="button"
                        onClick={() => { incrementWeek(-1) }}>{"<"}</button>
                </span>
            </div>
            <hr/>
            <div id="day-list">
                {/* One Day component for each day of the current week. */}
                {Array(7).fill().map((_, i) => <Day key={weekStart + i} date={dateIncremented(weekStart, i)} />)}
            </div>
            
        </>
    )
}

// Component that represents a Day entry within the week view list.
function Day({ date }) {
    const [calendars] = useContext(CalendarContext);
    const [, setEvent] = useContext(EventContext);
    
    const [events, setEvents] = useState([]);

    // Creates a date object from a string with the following format:
    // YYYY-MM-DD
    function parseDate(dateString) {
        return new Date(dateString + "T00:00:00");
    }

    // Returns a list of events occuring on this day contained by any visible calendars.
    // List will be sorted by time range. Events without a time range will appear first.
    async function getEvents() {
        const events = [];
        // add all events in visible calendars that occur on this day to the event list
        Object.keys(calendars).forEach((key) => {
            const calendar = calendars[key];
            if (calendar.visible) {
                calendar.events.forEach((event) => {
                    event.calendarId = key;

                    const startDate = parseDate(event.start.date);
                    const endDate = (event.end && event.end.date) ? parseDate(event.end.date) : null;
                    // if the event's start date occurs on this date, or this date falls within
                    // the event's date range, add it to the list
                    if ((startDate.toDateString() === date.toDateString() && !endDate)
                        || (startDate <= date && endDate >= date)) {
                        events.push(event);
                    }
                });
            }
        });    

        // sort the event list based on time range
        events.sort((a, b) => {
            // check if a or b has no time range
            if (!a.start.time) {
                return -1;
            }
            if (!b.start.time) {
                return -1;
            }

            // if start times are equal and both have end times, compare end times
            if (a.start.time === b.start.time
                && a.end && a.end.time && b.end && b.end.time) {

                return a.end.time.localeCompare(b.end.time);
            } 
            // otherwise, compare start times
            return a.start.time.localeCompare(b.start.time);
        });

        setEvents(events);
    }

    function handleAddClick() {
        setEvent({ 
            start: { date: date.toISOString().split('T')[0] },
            custom_fields: {}
        });
    }

    useEffect(() => {
        getEvents();
    }, [calendars])

    return (
        <>
            <h6 id={(date.toDateString() === new Date().toDateString()) ? "today" : ""}>{
                date.toLocaleString("default", {weekday: "long"}) + " "
                    + date.toLocaleString("default", {month: "short"}) + " "
                    + date.getDate()}
                {/* the add event button */}
                <Link className="add-event btn btn-outline-secondary" to="/new-event/" onClick={handleAddClick}>+</Link>
            </h6>
            {/* List of the events mapped to Event components. */}
            {events && events.map((event, i) => { return <Event key={event._id} event={event}/> })}
            <hr/>
        </>
    )
}

// Component that represents an Event entry within the week view list.
function Event({ event }) {
    const [, setEvent] = useContext(EventContext);
    const [calendars, , refreshCalendars] = useContext(CalendarContext);

    const [mouseOver, setMouseOver] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    // Returns a string based on the time range of the event. Format
    // ": HH:MM (AM|PM)" if no end time
    // ": HH:MM (AM|PM) - HH:MM (AM|PM)" if end time
    // "" if no time range at all
    function timeRangeString() {
        function dateForTime(time) {
            return new Date(`0000-01-01T${time}:00`);
        }

        let result = "";
        if (event.start.time) {
            result += ": " + dateForTime(event.start.time).toLocaleString('en-US', 
                { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        if (event.end && event.end.time) {
            result += " - " + dateForTime(event.end.time).toLocaleString('en-US', 
                { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        return result;
    }

    function handleMouseLeave() {
        setMouseOver(false);
        setConfirmDelete(false);
    }

    function handleMouseEnter() {
        setMouseOver(true);
    }

    function handleEditClick() {
        setEvent(event);
    }

    async function handleDeleteClick() {
        if (confirmDelete) {
            try {
                await fetch("http://localhost:2000/event", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        eventId: event._id,
                        calendarId: event.calendarId
                    })
                });
                refreshCalendars();
            } catch (err) {
                console.error("File deletion failed: " + err);
            }
        } else {
            setConfirmDelete(true);
        }
    }

    return (
        <>
            <hr/>
            <div className="container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <p className="evt-header text-body-secondary">
                    {event.name + timeRangeString()}
                    {mouseOver && <>
                        <Link to="/edit-event/" className="btn btn-outline-primary" style={{"marginLeft" : "10px"}}
                            onClick={handleEditClick}>Edit</Link>
                        <button className="btn btn-outline-secondary" style={{"marginLeft" : "10px"}}
                            onClick={handleDeleteClick}>{confirmDelete ? "Confirm" : "Delete"}</button>
                    </>}
                </p>
                <p className="evt-cal text-body-secondary">{calendars[event.calendarId].name}</p>
                {event.custom_fields && Object.keys(event.custom_fields).map((key) => {
                    return (
                        <div key={key}>
                            <p className="field-text text-body-secondary">{key}: {event.custom_fields[key]}</p>
                        </div>
                    );    
                })}
                {event.location && <LocationField location={event.location} />}
            </div>
        </>
    )
}

function LocationField({ location }) {
    const [showMap, setShowMap] = useState(false);

    return (
        <>
            <div>
                <p className="field-text text-body-secondary">Location: {location}</p>
                <button
                    className="map-btn btn btn-outline-secondary" 
                    type="button" 
                    onClick={() => setShowMap(!showMap)}>

                    <img src={require('../../images/maps-icon.png')} alt="map icon"></img>
                </button>
                {/* This currently yields a warning regarding loading the API directly, 
                    so there is likely a better way to do this. It works for now though. */}
                {showMap && <iframe
                    width="300px"
                    height="300px"
                    style={{display: "block", margin: "10px"}}
                    loading="lazy"
                    title="map-frame"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCL7h3KXCa-vKkb9e-K32pYLSD6-ZrtzEs
                            &q=${location}`}>
                </iframe>}
            </div>
        </>
    )
}

export default WeekView;