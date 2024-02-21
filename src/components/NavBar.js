import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <footer className="navbar fixed-bottom navbar-light bg-light">
      <nav className="nav nav-fill w-100">
        <Link className="nav-link" to="/month/">
          Month
        </Link>
        <Link className="nav-link" to="/">
          Week
        </Link>
        <Link className="nav-link" to="/messages/">
          Messages
        </Link>
        <Link className="nav-link" to="/settings/">
          Settings
        </Link>
      </nav>
    </footer>
  );
}

export default NavBar;