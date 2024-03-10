import '../css/CalendarFields.css';

import React, { useState, useEffect, useContext } from 'react';
import Input from './Input';
import { CalendarContext } from './LoggedInWrapper';
import ConfirmableButton from './ConfirmableButton';

function CalendarFields() {
  const { selectedCalendar, setSelectedCalendar } = useContext(CalendarContext);

  const [eventTypes, setEventTypes] = useState({});
  const [newEventType, setNewEventType] = useState(null);

  async function getCalendarEventTypes() {
    try {
        const types = {};
        for (const id of selectedCalendar.event_types) {
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

  function handleEventTypeAddClick() {
    setNewEventType({fields: {}});
  }

  useEffect(() => {
    getCalendarEventTypes();
  }, [selectedCalendar])

  return (
    <>
      <Input name="Name" type="text" reqd={true} value={selectedCalendar.name}
        onChange={(e) => setField("name", e.target.value, selectedCalendar, setSelectedCalendar)} />
      <div>
          <label className="form-label mt-4">
            Event Types
            <button className="add-event-type btn btn-outline-secondary" type="button" onClick={handleEventTypeAddClick}>+</button>
          </label>
          <hr />
          {newEventType && <NewEventType data={newEventType} setData={setNewEventType} />}
          {Object.keys(eventTypes).map((key) => <EventType key={key} eventType={eventTypes[key]} 
            onDelete={getCalendarEventTypes} />)}
      </div>
    </>
  );
}

function setField(field, value, object, setter) {
  const updatedObject = JSON.parse(JSON.stringify(object));
  updatedObject[field] = value;
  setter(updatedObject);
}

function NewEventType( { data, setData }) {
  const {selectedCalendar, setSelectedCalendar} = useContext(CalendarContext);

  const [newField, setNewField] = useState(null)

  function handleFieldCreateClick() {
    const newData = JSON.parse(JSON.stringify(data));
    newData.fields[newField.name] = newField;
    setData(newData);
    setNewField(null);
  }

  function handleFieldAddClick() {
    setNewField({ type: "text" });
  }
  
  async function handleAdd() {
    try {
      const response = await fetch("http://localhost:2000/event/type", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: data
        })
      });

      const result = await response.json();

      if (result.success) {
        const newCalendar = JSON.parse(JSON.stringify(selectedCalendar));
        newCalendar.event_types.push(result.event_type._id);
        newCalendar.added_event_types.push(result.event_type._id);
        setSelectedCalendar(newCalendar);
        setData(null);
      }
    } catch (error) {
      console.error("Unable to create event type: " + error);
    }
    
  }

  function handleCancel() {
    setData(null);
  }

  return (
    <>
      <div className="card bg-light">
        <div className="card-header">Add Event Type</div>
        <div className="card-body">
        <Input name="Name" type="text" reqd={true} value={data.name}
          onChange={(e) => setField("name", e.target.value, data, setData)} />
        <label className="form-label mt-4">
          Fields
          <button className="add-event-type btn btn-outline-secondary" type="button" onClick={handleFieldAddClick}>+</button>
        </label>
        {newField && <NewEventTypeField data={newField} setData={setNewField} onAdd={handleFieldCreateClick}
          onCancel={() => setNewField(null)} />}
        {Object.keys(data.fields).map((key) => {
          return (
            <div key={key}>
              <hr />
              <p className="text-body-secondary mb-0">{key}</p>
              <p className="text-body-secondary mb-0">Type: {data.fields[key].type}</p>
              <p className="text-body-secondary">
                {data.fields[key].required ? "Required" : "Optional"}
              </p>
            </div>
          );
        })}

        <button type="button" className="btn btn-outline-primary mt-4" onClick={handleAdd}>Add</button>
        <button type="button" className="btn btn-outline-secondary mt-4" style={{ "marginLeft": "10px" }}
          onClick={handleCancel}>Cancel</button>
        </div>

      </div>
    </>
  )
}

function NewEventTypeField({ data, setData, onAdd, onCancel }) {
  return (
    <>
      <div className="card bg-light">
        <div className="card-header">Add Event Type Field</div>
        <div className="card-body">
          <Input name="Name" type="text" reqd={true} value={data.name}
            onChange={(e) => setField("name", e.target.value, data, setData)} />

          <div>
            <label htmlFor="field-type-select" className="form-label mt-4">Type</label>
            <select className="form-select" id="field-type-select" value={data.type} 
              onChange={(e) => setField("type", e.target.value, data, setData)}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="location">Location</option>
            </select>
          </div>

          <label htmlFor={data.name + "-reqd-check"} className="form-label mt-4">
            Required
            <input
              className="form-check-input"
              type="checkbox"
              value={data.required}
              id={data.name + "-reqd-check"}
              style={{ marginLeft: "10px" }}
              onChange={(e) => setField("required", e.target.checked, data, setData)}
            />
          </label>


          <button type="button" className="btn btn-outline-primary mt-4" onClick={onAdd}>Add</button>
          <button type="button" className="btn btn-outline-secondary mt-4" style={{ "marginLeft": "10px" }}
            onClick={onCancel}>Cancel</button>
        </div>

      </div>
    </>
  )
}

function EventType({ eventType, onDelete }) {
  const {selectedCalendar} = useContext(CalendarContext);

  const [mouseOver, setMouseOver] = useState(false);

  function handleMouseLeave() {
    setMouseOver(false);
  }

  function handleMouseEnter() {
    setMouseOver(true);
  }

  async function handleDelete() {
    try {
      const id = eventType._id;
      const response = await fetch("http://localhost:2000/event/type/" + id, {
        method: "DELETE",
        credentials: "include"
      });
      if ((await response.json()).success) {
        selectedCalendar.event_types.splice(selectedCalendar.event_types.indexOf(id), 1);
        if (onDelete) onDelete();
      }
    } catch (err) {
      console.error("Event type deletion failed: " + err);
    }
  }

  return (
    <>
      <div className="container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <strong className="evt-type-header">
          {eventType.name}
          {mouseOver && <>
            <ConfirmableButton className="btn btn-outline-secondary" style={{ "marginLeft": "10px" }}
              onConfirm={handleDelete} text="Delete" />
          </>}
        </strong>
        {Object.keys(eventType.fields).map((key) => {
          return (
            <div key={key}>
              <p className="text-body-secondary mb-0">Field: {key}</p>
              <p className="text-body-secondary mb-0">Type: {eventType.fields[key].type}</p>
              <p className="text-body-secondary">
                {eventType.fields[key].required ? "Required" : "Optional"}
              </p>
            </div>
          );
        })}
        <hr />
      </div>
    </>

  );;
}

export default CalendarFields;