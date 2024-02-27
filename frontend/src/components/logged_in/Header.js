import React, { useState } from "react";
import CalendarSelect from "./CalendarSelect";

function Header() {
    const [calSelectOpen, setCalSelectOpen] = useState(false);

    function handleDropdownClick() {
        setCalSelectOpen(!calSelectOpen);
    }

    return (
        <>
            <nav className="navbar navbar-dark bg-primary" data-bs-theme="dark">
                <div className="container">
                    <a className="navbar-brand mb-0 h1" href="/#">CalPal</a>
                    {/* button for toggling the calendar selection dropdown */}
                    <button className="navbar-toggler" type="button" onClick={handleDropdownClick}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
            {/* if calendar selection should be open, show its componenent, otherwise return null */}
            {(calSelectOpen) ? <CalendarSelect/> : null}
        </>
    )
}
export default Header;