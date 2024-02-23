// CalPal
// WeekView.js
// Trae Claar

import '../css/WeekView.css';

import React, {useState, useContext} from 'react';
import {CalendarContext} from './LoggedInWrapper';

function WeekView() {
    // date object for today's date
    const today = new Date();
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
                {Array(7).fill().map((_, i) => <Day key={i} date={dateIncremented(weekStart, i)} />)}
            </div>
            
        </>
    )
}

// Component that represents a Day entry within the week view list.
function Day({ date }) {
    const [calendars] = useContext(CalendarContext);

    // Creates a date object from a string with the following format:
    // YYYY-MM-DD
    function parseDate(dateString) {
        return new Date(dateString + "T00:00:00");
    }

    // Returns a list of events occuring on this day contained by any visible calendars.
    // List will be sorted by time range. Events without a time range will appear first.
    function getEvents() {
        const events = [];

        // add all events in visible calendars that occur on this day to the event list
        Object.keys(calendars).forEach((key) => {
            const calendar = calendars[key];
            if (calendar.visible) {
                calendar.events.forEach((event) => {
                    event.calendarName = calendar.name;

                    const startDate = parseDate(event.date_range[0]);
                    const endDate = (event.date_range[1]) ? parseDate(event.date_range[1]) : null;
                    // if the event's start date occurs on this date, or this date falls within
                    // the event's date range, add it to the list
                    if ((startDate.toDateString() === date.toDateString() && !endDate)
                        || (startDate <= date && endDate >= date)) {
                        events.push(event);
                    }
                });
            }
        });

        // Helper function that compares two time strings of the format HH:MM (AM | PM), 
        // e.g. "12:00 PM".
        // Return is < 0 if a < b, > 0 if a > b, and = 0 if a = b.
        function compareTime(a, b) {
            // a = b
            if (a === b) {
                return 0;
            }

            const aPeriod = a.slice(-2);
            const bPeriod = b.slice(-2);
            // one of a and b is AM and the other is PM
            if (aPeriod !== bPeriod) {
                // a is AM, so b is PM and a < b
                if (aPeriod === "AM") {
                    return -1;
                } 
                // a is PM, so b is AM, and a > b
                return 1;
            }

            // return hours and minutes of a - hours and minutes of b
            return (a.slice(0, 5).replace(":", "")) - (b.slice(0, 5).replace(":", ""));
        }

        // sort the event list based on time range
        events.sort((a, b) => {
            // check if a or b has no time range
            if (!a.time_range[0]) {
                return -1;
            }
            if (!b.time_range[0]) {
                return -1;
            }

            // if start times are equal and both have end times, compare end times
            if (compareTime(a.time_range[0], b.time_range[0]) === 0
                && a.time_range[1] && b.time_range[1]) {

                return compareTime(a.time_range[1], b.time_range[1]);
            } 
            // otherwise, compare start times
            return compareTime(a.time_range[0], b.time_range[0]);
        });

        return events;
    }

    const events = getEvents();

    return (
        <>
            <h6>{
                date.toLocaleString("default", {weekday: "long"}) + " "
                    + date.toLocaleString("default", {month: "short"}) + " "
                    + date.getDate()}
                {/* the add event button */}
                <button className="add-event btn btn-outline-secondary" type="button">+</button>
            </h6>
            {/* List of the events mapped to Event components. */}
            {events.map((event, i) => { return <Event key={i} event={event}/> })}
            <hr/>
        </>
    )
}

// Component that represents an Event entry within the week view list.
function Event({ event }) {
    
    // Returns a string based on the time range of the event. Format
    // ": HH:MM (AM|PM)" if no end time
    // ": HH:MM (AM|PM) - HH:MM (AM|PM)" if end time
    // "" if no time range at all
    function timeRangeString() {
        let result = "";
        if (event.time_range[0]) {
            result += ": " + event.time_range[0].toLocaleString('en-US', 
                { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        if (event.time_range[1]) {
            result += " - " + event.time_range[1].toLocaleString('en-US', 
                { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        return result;
    }

    return (
        <>
            <hr/>
            <div className="container">
                <p className="evt-header text-body-secondary">{event.name + timeRangeString()}</p>
                <p className="evt-cal text-body-secondary">{event.calendarName}</p>
            </div>
        </>
    )
}

export default WeekView;