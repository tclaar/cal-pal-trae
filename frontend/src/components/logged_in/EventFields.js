import React, { useState, useEffect, useContext } from "react";
import Input from './Input';
import { EventContext } from './LoggedInWrapper';

function EventFields() {
    const [event, setEvent] = useContext(EventContext);
    
    const [customFields, setCustomFields] = useState({});

    async function getEventTypeFields() {
        if (event.type) {
            try {
                const response = await fetch(`http://localhost:2000/event/type/${event.type}`, {
                    method: "GET"
                });
                const data = await response.json();
                setCustomFields(data.event_type.fields);
            } catch (error) {
                console.error("Unable to get fields for event type: " + error);
            }
        } else {
            setCustomFields({});
        }
    }

    function setField(value, ...path) {
        const updatedEvent = JSON.parse(JSON.stringify(event));
        let field = updatedEvent;
        for (let i = 0; i < path.length - 1; i++) {
            if (!field[path[i]]) {
                field[path[i]] = {};
            }
            field = field[path[i]];
            
        }
        field[path[path.length - 1]] = value;
        setEvent(updatedEvent);
    }

    function setCustomField(field, value) {
        const updatedEvent = JSON.parse(JSON.stringify(event));
        if (!updatedEvent.custom_fields) {
            updatedEvent.custom_fields = {};
        }
        updatedEvent.custom_fields[field] = value;
        setEvent(updatedEvent);
    }

    function handleDateTimeChange(e, startOrEnd, dateOrTime) {
        setField(e.target.value, startOrEnd, dateOrTime);
        if (startOrEnd === "start") {
            if (event.end && event.end[dateOrTime] && e.target.value > event.end[dateOrTime]) {
                return `Start ${dateOrTime} must not come after end ${dateOrTime}.`
            }
        } else if (e.target.value && e.target.value < event.start[dateOrTime]) {
            return `End ${dateOrTime} must not come before start ${dateOrTime}.`
        }
    }

    useEffect(() => {
        getEventTypeFields();
    }, [event])

    return (
        <>
            <Input name="Name" type="text" reqd={true} value={event.name} 
                onChange={(e) => setField( e.target.value, "name")} />
            <Input name="Start Date" type="date" reqd={true} value={event.start ? event.start.date : ""} 
                onChange={(e) => handleDateTimeChange(e, "start", "date")} />
            <Input name="End Date" type="date" reqd={false} value={event.end ? event.end.date : ""} 
                onChange={(e) => handleDateTimeChange(e, "end", "date")} />
            <Input name="Start Time" type="time" reqd={false} value={event.start ? event.start.time : ""} 
                onChange={(e) => handleDateTimeChange(e, "start", "time")} />
            <Input name="End Time" type="time" reqd={false} value={event.end ? event.end.time : ""} 
                onChange={(e) => handleDateTimeChange(e, "end", "time")} />

            {Object.keys(customFields).map((key) => {
                return (
                    <Input name={key} key={key} type={customFields[key]} reqd={customFields[key].required}
                        value={event.custom_fields && event.custom_fields[key]} onChange={(e) => setCustomField(key, e.target.value)} />
                );
            })}
        </>
    )
}

export default EventFields;