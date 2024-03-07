// CalPal
// NewEvent.js
// Trae Claar

import '../css/NewEvent.css';

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarContext, EventContext } from './LoggedInWrapper';
import EventFields from './EventFields';

function NewEvent() {
    const navigate = useNavigate();

    const [calendars, , refreshCalendars] = useContext(CalendarContext);
    const [event, setEvent] = useContext(EventContext);
    
    const [calendar, setCalendar] = useState("");
    const [eventTypes, setEventTypes] = useState({})
    const [type, setType] = useState("");

    function handleChangeCalendar(e) {
        setType("");
        setCalendar(e.target.value);
    }

    async function getCalendarEventTypes() {
        if (!calendar) return;

        try {
            const types = {};
            for (const id of calendars[calendar].event_types) {
                const response = await fetch(`http://localhost:2000/event/type/${id}`, {
                    method: "GET"
                });
                types[id] = (await response.json()).event_type;
            }
            setEventTypes(types);
        } catch (error) {
            console.error("Unable to fetch event types: " + error);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:2000/event/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    event: event,
                    calendarId: calendar
                })
            });
            
            if ((await response.json()).success) {
                navigate("/", { replace: true });
                refreshCalendars();
            }
        } catch (error) {
            console.error("Unable to create event: " + error);
        }
    }

    useEffect(() => {
        const newEvent = JSON.parse(JSON.stringify(event));
        newEvent.type = type;
        setEvent(newEvent);
    }, [type])

    useEffect(() => {
        getCalendarEventTypes();
    }, [calendar])

    return (
        <>
            <div className="page-header">
                <h3 id="viewTitle">New Event</h3>
            </div>
            <hr />

            <div id="event-form">
                <div>
                    <label htmlFor="calendar-select" className="form-label mt-4">Calendar</label>
                    <select className="form-select" id="calendar-select" value={calendar} onChange={handleChangeCalendar}>
                        <option></option>
                        {Object.keys(calendars).map((id) => {
                            return <option key={id} value={id}>{calendars[id].name}</option>
                        })}
                    </select>
                </div>

                <div>
                    <label htmlFor="type-select" className="form-label mt-4">Event Type</label>
                    <select className="form-select" id="type-select" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value={""}>Standard</option>
                        {calendar && Object.keys(eventTypes).map((id) => { 
                            return <option key={id} value={id}>{eventTypes[id].name}</option> 
                        })}
                    </select>
                </div>

                <EventFields />

            </div>

            <Link to="/"className="btn btn-outline-primary mt-4" onClick={handleCreate}>Create</Link>
            <Link to="/"className="btn btn-outline-secondary mt-4" style={{"marginLeft" : "10px"}}>Cancel</Link>
        </>
    );
}

export default NewEvent;