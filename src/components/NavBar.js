
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar() {
  return (
    <footer className="navbar fixed-bottom navbar-light bg-light">
      <nav className="nav nav-fill w-100">
        <a className="nav-link" href="#month">
          Month
        </a>
        <a className="nav-link" href="#week">
          Week
        </a>
        <a className="nav-link" href="#messages">
          Messages
        </a>
        <a className="nav-link" href="#settings">
          Settings
        </a>
      </nav>
    </footer>
  );
}

export default NavBar;