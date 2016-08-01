import React from 'react';
import { Link } from 'react-router';

export default function Footer () {
  return (
    <ul className="footer">
      <li className="footer__item">
        <Link to="/about">About</Link>
      </li>
      <li className="footer__item">
        <Link to="/ethics">Code of Ethics</Link>
      </li>
      <li className="footer__item">
        <Link to="/team">Our Team</Link>
      </li> {/* On hover, change to "the herd" */}
      <li className="footer__item">
        <Link to="/archives">Previous Issues</Link>
      </li> {/* Change to a button (??) */}
    </ul>
  );
}
