import React from 'react';
import { Link } from 'react-router';
import BaseComponent from 'lib/BaseComponent';

export default class Footer extends BaseComponent {
  render() {
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
        </li>
        <li className="footer__item">
          <Link to="/archives">Previous Issues</Link>
        </li>
      </ul>
    );
  }
}
