import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarFields from './CalendarFields';
import { CalendarContext } from './LoggedInWrapper';

function NewCalendar() {
  const navigate = useNavigate();

  const { refreshCalendars, selectedCalendar } = useContext(CalendarContext);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/calendar/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calendar: selectedCalendar
        })
      });

      if ((await response.json()).success) {
        navigate("/", { replace: true });
        refreshCalendars();
      }
    } catch (error) {
      console.error("Unable to create calendar: " + error);
    }
  }

  async function handleCancel() {
    for (const id of selectedCalendar.event_types) {
      try {
        await fetch("http://localhost:2000/event/type/" + id, {
          method: "DELETE",
          credentials: "include"
        });
      } catch (err) {
        console.error(`Failed to delete event type with ID ${id}: ${err}`);
      }
    }
  }

  return (
    <>
      <div className="page-header">
        <h3 id="viewTitle">New Calendar</h3>
      </div>
      <hr />

      <div id="event-form">
        <CalendarFields />
      </div>

      <Link to="/" className="btn btn-outline-primary mt-4" onClick={handleCreate}>Create</Link>
      <Link to="/" className="btn btn-outline-secondary mt-4" style={{ "marginLeft": "10px" }}
        onClick={handleCancel}>Cancel</Link>
    </>
  );
}
export default NewCalendar;