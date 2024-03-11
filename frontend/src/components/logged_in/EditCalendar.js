import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarFields from './CalendarFields';
import { CalendarContext } from './LoggedInWrapper';
import ConfirmableButton from './ConfirmableButton';

function EditCalendar() {
  const navigate = useNavigate();

  const { refreshCalendars, selectedCalendar } = useContext(CalendarContext);

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/calendar/", {
        method: "PUT",
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
      console.error("Unable to update calendar: " + error);
    }
  }

  async function deleteEventTypesFromIDList(list) {
    for (const id of list) {
      try {
        const response = await fetch("http://localhost:2000/event/type/" + id, {
          method: "DELETE",
          credentials: "include"
        });
        if ((await response.json()).success) {
          selectedCalendar.event_types.splice(selectedCalendar.event_types.indexOf(id), 1);
        }
      } catch (err) {
        console.error(`Failed to delete event type with ID ${id}: ${err}`);
      }
    }
  }

  function handleCancel() {
    deleteEventTypesFromIDList(selectedCalendar.added_event_types);
  }

  async function handleDelete() {
    await deleteEventTypesFromIDList(selectedCalendar.event_types);

    try {
      const response = await fetch("http://localhost:2000/calendar/" + selectedCalendar._id, {
        method: "DELETE",
        credentials: "include"
      });
      if ((await response.json()).success) {
        navigate("/", { replace: true });
        refreshCalendars()
      }
    } catch (err) {
      console.error(`Failed to delete calendar: ${err}`);
    }
  }

  return (
    <>
      <div className="page-header">
        <h3 id="viewTitle">Edit Calendar</h3>
      </div>
      <hr />

      <div id="event-form">
        <CalendarFields />
      </div>

      <Link to="/" className="btn btn-outline-primary mt-4" onClick={handleUpdate}>Update</Link>
      <Link to="/" className="btn btn-outline-secondary mt-4" style={{ "marginLeft": "10px" }}
        onClick={handleCancel}>Cancel</Link>
      <ConfirmableButton className="btn btn-outline-secondary mt-4" style={{ "marginLeft": "10px" }}
        text="Delete" onConfirm={handleDelete} />
    </>
  );
}
export default EditCalendar;