import React from "react";
import { Link } from "react-router-dom";
import "./home-page.scss";

const HomePage = () => {
  return (
    <div className="home-view">
      Home Page
      <nav>
        <ul>
          <li>
            <Link to="/loadable-page">Go to Loadable Page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
