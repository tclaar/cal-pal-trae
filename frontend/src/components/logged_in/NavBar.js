import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <footer className="navbar fixed-bottom navbar-light bg-primary">
      <nav className="nav nav-fill w-100">
        <Link className="nav-link text-white" to="/month/">
          Month
        </Link>
        <div className="navbar-line"></div>
        <Link className="nav-link text-white" to="/">
          Week
        </Link>
        <div className="navbar-line"></div>
        <Link className="nav-link text-white" to="/messages/">
          Messages
        </Link>
        <div className="navbar-line"></div>
        <Link className="nav-link text-white" to="/settings/">
          Settings
        </Link>
      </nav>
    </footer>
  );
}

export default NavBar;