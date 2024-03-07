import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import EventFields from "./EventFields";
import { CalendarContext, EventContext } from './LoggedInWrapper';

function EditEvent() {
    const navigate = useNavigate();

    const [event] = useContext(EventContext);
    const [, , refreshCalendars] = useContext(CalendarContext);

    async function handleUpdateClick(e) {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:2000/event`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    event: event,
                    calendarId: event.calendarId
                })
            });
            
            if ((await response.json()).success) {
                navigate("/", { replace: true });
                refreshCalendars();
            }
        } catch (error) {
            console.error("Unable to update event: " + error);
        }
    }

    return (
        <>
            <div className="page-header">
                <h3 id="viewTitle">Edit Event</h3>
            </div>
            <hr />

            <div id="event-form">
                <EventFields />
            </div>

            <Link to="/"className="btn btn-outline-primary mt-4" onClick={handleUpdateClick}>Update</Link>
            <Link to="/"className="btn btn-outline-secondary mt-4" style={{"marginLeft" : "10px"}}>Cancel</Link>
        </>
    );
}
export default EditEvent;