import React from 'react';
import { Link } from 'react-router-dom';
import '../Sidebar.css';

function Sidebar() {
  return (
    <aside>
      <nav>
        <ul>
          <li><Link to="/create-segment">Create Segment</Link></li>
          <li><Link to="/create-rule">Create Rule</Link></li>
          <li><Link to="/rules">Rule</Link></li>
          <li><Link to="/profiles">Profiles</Link></li>
          <li><Link to="/segments">Segments</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
